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

  // PAGINATION
  currentPage = 1;
  itemsPerPage = 10;

  // SORTING
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'desc';

  // STATUS OPTIONS
  statusOptions = [
    { value: 'open', label: 'open' },
    { value: 'in_progress', label: 'in_progress' },
    { value: 'closed', label: 'closed' }
  ];

  // ASSIGN DIALOG
  showAssignDialog = false;
  selectedTicketId: string = '';
  selectedTicketAssignedToId: string = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.ticketService.getTickets().subscribe({
      next: (res: any) => {
        this.tickets = res.data || res;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load tickets. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // ===== SORTING =====
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  get sortedTickets(): Ticket[] {
    return [...this.filteredTickets].sort((a: any, b: any) => {
      let valA = a[this.sortColumn] ?? '';
      let valB = b[this.sortColumn] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // ===== NOTIFICATION =====
  showNotif(type: 'success' | 'error' | 'warning', message: string) {
    this.notifType = type;
    this.notifMessage = message;
    this.showNotification = true;
    setTimeout(() => { this.showNotification = false; }, 3000);
  }

  // ===== DELETE =====
  deleteTicket(ticket: Ticket) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ticket "${ticket.title}"?`
    );
    if (!confirmDelete) return;
    this.ticketService.deleteTicket(String(ticket.id)).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(t => t.id !== ticket.id);
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
        this.showNotif('success', 'Ticket deleted successfully!');
      },
      error: () => {
        this.showNotif('error', 'Failed to delete ticket');
      }
    });
  }

  // ===== ASSIGN =====
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
    if (result.success) { this.loadTickets(); }
  }

  // ===== STATUS CHANGE =====
  onStatusChange(ticket: Ticket, newStatus: string) {
    const oldStatus = ticket.status;
    ticket.status = newStatus;
    this.ticketService.updateStatus(String(ticket.id), newStatus).subscribe({
      next: () => { this.showNotif('success', `Status updated to "${newStatus}"`); },
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

  // ===== SEARCH =====
  get filteredTickets(): Ticket[] {
    if (!this.searchText) return this.tickets;
    return this.tickets.filter(t =>
      t.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (t.status || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (t.assignedTo || '').toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // ===== PAGINATION =====
  get paginatedTickets(): Ticket[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.sortedTickets.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTickets.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}