import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TicketService } from '../services/ticket.service';
import { User } from '../models/user';

@Component({
  selector: 'app-assign-ticket',
  templateUrl: './assign-ticket.component.html',
  styleUrls: ['./assign-ticket.component.css']
})
export class AssignTicketComponent implements OnInit {

  @Input() ticketId!: string;
  @Input() currentAssignedToId: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() assigned = new EventEmitter<{ success: boolean; message: string; email_notification_sent?: boolean }>();

  users: User[] = [];
  selectedUserId: string = '';
  isLoading = true;
  isSaving = false;

  constructor(
    private userService: UserService,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.selectedUserId = this.currentAssignedToId || '';
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (res: User[]) => {
        // Only show employees (not admins) in assignment list
        this.users = res.filter(u => u.role !== 'Admin' && u.role !== 'admin');
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onAssign() {
    if (!this.selectedUserId) {
      return;
    }

    this.isSaving = true;

    this.ticketService.assignTicket(this.ticketId, this.selectedUserId).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.assigned.emit({
          success: true,
          message: 'Ticket assigned successfully!',
          email_notification_sent: res?.email_notification_sent
        });
      },
      error: () => {
        this.isSaving = false;
        this.assigned.emit({
          success: false,
          message: 'Failed to assign ticket.',
          email_notification_sent: undefined
        });
      }
    });
  }

  onCancel() {
    this.close.emit();
  }
}