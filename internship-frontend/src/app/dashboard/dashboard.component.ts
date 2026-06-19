import { Component, OnInit } from '@angular/core';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cards = [
    { label: 'Total Tickets', value: '...', icon: '🎫', color: '#1D9E75' },
    { label: 'Open Tickets', value: '...', icon: '📂', color: '#e67e22' },
    { label: 'Closed Tickets', value: '...', icon: '✅', color: '#3498db' },
    { label: 'High Priority', value: '...', icon: '🔴', color: '#e74c3c' }
  ];

  isLoading = true;

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.ticketService.getStats().subscribe({
      next: (stats: any) => {
        this.cards[0].value = String(stats.total ?? stats.total_tickets ?? '0');
        this.cards[1].value = String(stats.open ?? stats.open_tickets ?? '0');
        this.cards[2].value = String(stats.closed ?? stats.closed_tickets ?? '0');
        this.cards[3].value = String(stats.high_priority ?? stats.high_priority_tickets ?? '0');
        this.isLoading = false;
      },
      error: () => {
        this.cards.forEach(c => c.value = 'N/A');
        this.isLoading = false;
      }
    });
  }
}