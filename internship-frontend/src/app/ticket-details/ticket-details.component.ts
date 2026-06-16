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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
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

  goBack() {
    this.router.navigate(['/tickets']);
  }
}