import { Component } from '@angular/core';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent {
  searchText = '';

  tickets = [
    { id: 'TKT-001', title: 'Login page not working', status: 'Open', priority: 'High', assignedTo: 'Rahul Sharma' },
    { id: 'TKT-002', title: 'Dashboard data not loading', status: 'In Progress', priority: 'Medium', assignedTo: 'Priya Singh' },
    { id: 'TKT-003', title: 'Profile photo upload fails', status: 'Closed', priority: 'Low', assignedTo: 'Amit Kumar' },
    { id: 'TKT-004', title: 'Email notifications not sent', status: 'Open', priority: 'High', assignedTo: 'Sneha Gupta' },
    { id: 'TKT-005', title: 'Password reset broken', status: 'In Progress', priority: 'High', assignedTo: 'Harshita Gupta' },
    { id: 'TKT-006', title: 'Search filter not working', status: 'Open', priority: 'Medium', assignedTo: 'Rohit Verma' },
    { id: 'TKT-007', title: 'Export to PDF failing', status: 'Closed', priority: 'Low', assignedTo: 'Neha Joshi' },
    { id: 'TKT-008', title: 'Mobile layout broken', status: 'Open', priority: 'Medium', assignedTo: 'Harshita Gupta' }
  ];

  get filteredTickets() {
    if (!this.searchText) return this.tickets;
    return this.tickets.filter(t =>
      t.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}