import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  ticket: Ticket | undefined;
  isLoading = true;
  errorMessage = '';

  // NOTIFICATION
  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  // ASSIGN DIALOG
  showAssignDialog = false;
  selectedTicketId: string = '';
  selectedTicketAssignedToId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.loadTicket();
  }

  loadTicket() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.isLoading = true;

    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.isLoading = false;
        if (!data) {
          this.errorMessage = 'Ticket not found.';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load ticket details.';
        this.isLoading = false;
      }
    });
  }

  // ===== ASSIGN TICKET =====

  openAssignDialog() {
    if (!this.ticket) return;
    this.selectedTicketId = String(this.ticket.id);
    this.selectedTicketAssignedToId = this.ticket.assignedToId || '';
    this.showAssignDialog = true;
  }

  closeAssignDialog() {
    this.showAssignDialog = false;
  }

  onAssignResult(result: { success: boolean; message: string }) {
    this.showAssignDialog = false;

    this.notifType = result.success ? 'success' : 'error';
    this.notifMessage = result.message;
    this.showNotification = true;

    if (result.success) {
      this.loadTicket(); // refresh to show updated assigned user
    }
  }

  goBack() {
    this.router.navigate(['/tickets']);
  }
}