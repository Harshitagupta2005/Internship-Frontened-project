import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private http: HttpClient) {}

  private tickets: Ticket[] = [
    { id: 'TKT-001', title: 'Login page not working', description: 'Users are unable to login with correct credentials.', status: 'Open', priority: 'High', assignedTo: 'Rahul Sharma' },
    { id: 'TKT-002', title: 'Dashboard data not loading', description: 'Dashboard shows blank screen after login.', status: 'In Progress', priority: 'Medium', assignedTo: 'Priya Singh' },
    { id: 'TKT-003', title: 'Profile photo upload fails', description: 'Upload button does not respond on click.', status: 'Closed', priority: 'Low', assignedTo: 'Amit Kumar' },
    { id: 'TKT-004', title: 'Email notifications not sent', description: 'Users not receiving email alerts.', status: 'Open', priority: 'High', assignedTo: 'Sneha Gupta' },
    { id: 'TKT-005', title: 'Password reset broken', description: 'Reset link in email expires immediately.', status: 'In Progress', priority: 'High', assignedTo: 'Harshita Gupta' },
    { id: 'TKT-006', title: 'Search filter not working', description: 'Search results do not update on input.', status: 'Open', priority: 'Medium', assignedTo: 'Rohit Verma' },
    { id: 'TKT-007', title: 'Export to PDF failing', description: 'PDF export throws 500 error.', status: 'Closed', priority: 'Low', assignedTo: 'Neha Joshi' },
    { id: 'TKT-008', title: 'Mobile layout broken', description: 'UI overlaps on screens below 768px.', status: 'Open', priority: 'Medium', assignedTo: 'Harshita Gupta' }
  ];

  getTickets(): Observable<Ticket[]> {
    return of(this.tickets).pipe(delay(1500));
  }
}