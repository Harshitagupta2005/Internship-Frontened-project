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

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load tickets. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteTicket(ticket: Ticket) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ticket "${ticket.title}"?\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    this.ticketService.deleteTicket(String(ticket.id)).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(t => t.id !== ticket.id);

        // Page fix karo agar current page ab exist nahi karta
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }

        this.notifType = 'success';
        this.notifMessage = `Ticket "${ticket.title}" deleted successfully!`;
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
      },
      error: () => {
        this.notifType = 'error';
        this.notifMessage = 'Failed to delete ticket. Please try again.';
        this.showNotification = true;
      }
    });
  }

  get filteredTickets(): Ticket[] {
    if (!this.searchText) return this.tickets;
    return this.tickets.filter(t =>
      t.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedTickets(): Ticket[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTickets.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTickets.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}