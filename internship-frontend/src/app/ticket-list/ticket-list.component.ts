import { Component, OnInit } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  tickets: Ticket[] = [];
  searchText = '';
  isLoading = true;
  errorMessage = '';

  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  // FRONTEND PAGINATION
  currentPage = 1;
  itemsPerPage = 10;

  // STATUS OPTIONS
  statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' }
  ];

  // ASSIGN DIALOG STATE
  showAssignDialog = false;
  selectedTicketId: string = '';
  selectedTicketAssignedToId: string = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit(){
    this.loadTickets();
  }

  loadTickets(){
    this.isLoading = true;

    this.ticketService.getTickets().subscribe({
      next:(res:any)=>{
        this.tickets = res.data || res;
        this.isLoading = false;
      },
      error:()=>{
        this.errorMessage = 'Failed to load tickets. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // ===== NOTIFICATION HELPER (auto-hide after 3 seconds) =====

  showNotif(type: 'success' | 'error' | 'warning', message: string) {
    this.notifType = type;
    this.notifMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  deleteTicket(ticket:Ticket){
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ticket "${ticket.title}"?`
    );

    if(!confirmDelete) return;

    this.ticketService.deleteTicket(String(ticket.id)).subscribe({
      next:()=>{
        this.tickets = this.tickets.filter(t=>t.id !== ticket.id);
        this.showNotif('success', 'Ticket deleted successfully!');
      },
      error:()=>{
        this.showNotif('error', 'Failed to delete ticket');
      }
    });
  }

  // ===== ASSIGN TICKET FEATURE =====

  openAssignDialog(ticket: Ticket) {
    this.selectedTicketId = String(ticket.id);
    this.selectedTicketAssignedToId = ticket.assignedToId || '';
    this.showAssignDialog = true;
  }

  closeAssignDialog() {
    this.showAssignDialog = false;
  }

  onAssignResult(result: { success: boolean; message: string }) {
    this.showAssignDialog = false;
    this.showNotif(result.success ? 'success' : 'error', result.message);

    if (result.success) {
      this.loadTickets();
    }
  }

  // ===== STATUS CHANGE FEATURE =====

  onStatusChange(ticket: Ticket, newStatus: string) {
    const oldStatus = ticket.status;
    ticket.status = newStatus;

    this.ticketService.updateStatus(String(ticket.id), newStatus).subscribe({
      next: () => {
        this.showNotif('success', `Status updated to "${newStatus}"`);
      },
      error: () => {
        ticket.status = oldStatus;
        this.showNotif('error', 'Failed to update status.');
      }
    });
  }

  getBadgeClass(status: string): string {
    const normalized = (status || '').toLowerCase().replace(' ', '_');
    return 'badge-' + normalized;
  }

  // ===== EXISTING GETTERS/PAGINATION (unchanged) =====

  get filteredTickets():Ticket[]{
    if(!this.searchText){
      return this.tickets;
    }
    return this.tickets.filter(t=>
      t.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedTickets():Ticket[]{
    const start = (this.currentPage-1) * this.itemsPerPage;
    return this.filteredTickets.slice(start, start + this.itemsPerPage);
  }

  get totalPages():number{
    return Math.ceil(this.filteredTickets.length / this.itemsPerPage);
  }

  changePage(page:number){
    if(page >=1 && page <= this.totalPages){
      this.currentPage = page;
    }
  }
}