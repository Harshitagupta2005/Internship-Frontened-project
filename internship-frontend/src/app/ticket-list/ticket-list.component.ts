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
      error: (err) => {
        this.errorMessage = 'Failed to load tickets. Please try again.';
        this.isLoading = false;
      }
    });
  }

  get filteredTickets(): Ticket[] {
    if (!this.searchText) return this.tickets;
    return this.tickets.filter(t =>
      t.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}