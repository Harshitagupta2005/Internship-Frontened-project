import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private tickets: Ticket[] = [
    { id: 'TKT-001', title: 'Login page not working', description: 'Users are unable to login with correct credentials.', status: 'Open', priority: 'High', assignedTo: 'Rahul Sharma', createdDate: '2026-06-01' },
    { id: 'TKT-002', title: 'Dashboard data not loading', description: 'Dashboard shows blank screen after login.', status: 'In Progress', priority: 'Medium', assignedTo: 'Priya Singh', createdDate: '2026-06-03' },
    { id: 'TKT-003', title: 'Profile photo upload fails', description: 'Upload button does not respond on click.', status: 'Closed', priority: 'Low', assignedTo: 'Amit Kumar', createdDate: '2026-06-05' },
    { id: 'TKT-004', title: 'Email notifications not sent', description: 'Users not receiving email alerts.', status: 'Open', priority: 'High', assignedTo: 'Sneha Gupta', createdDate: '2026-06-07' },
    { id: 'TKT-005', title: 'Password reset broken', description: 'Reset link in email expires immediately.', status: 'In Progress', priority: 'High', assignedTo: 'Harshita Gupta', createdDate: '2026-06-09' },
    { id: 'TKT-006', title: 'Search filter not working', description: 'Search results do not update on input.', status: 'Open', priority: 'Medium', assignedTo: 'Rohit Verma', createdDate: '2026-06-10' },
    { id: 'TKT-007', title: 'Export to PDF failing', description: 'PDF export throws 500 error.', status: 'Closed', priority: 'Low', assignedTo: 'Neha Joshi', createdDate: '2026-06-12' },
    { id: 'TKT-008', title: 'Mobile layout broken', description: 'UI overlaps on screens below 768px.', status: 'Open', priority: 'Medium', assignedTo: 'Harshita Gupta', createdDate: '2026-06-13' }
  ];

  getTickets(): Observable<Ticket[]> {
    return of(this.tickets).pipe(delay(1500));
  }

  getTicketById(id: string): Observable<Ticket | undefined> {
    const ticket = this.tickets.find(t => t.id === id);
    return of(ticket).pipe(delay(800));
  }
}