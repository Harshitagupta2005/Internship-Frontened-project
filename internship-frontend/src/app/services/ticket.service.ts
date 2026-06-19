import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<Ticket[]> {
    return this.http.get<any>(`${this.apiUrl}/tickets?per_page=100`).pipe(
      map((res: any) => {
        const list = res.data || [];
        return list.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          assignedTo: t.assigned_to?.name || 'Unassigned',
          createdDate: t.created_at?.substring(0, 10)
        }));
      }),
      catchError(() => throwError(() => new Error('API unavailable.')))
    );
  }

  getTicketById(id: string): Observable<Ticket> {
    return this.http.get<any>(`${this.apiUrl}/tickets/${id}`).pipe(
      map((res: any) => {
        const t = res.data || res;
        return {
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          assignedTo: t.assigned_to?.name || t.assignedTo || 'Unassigned',
          createdDate: t.created_at?.substring(0, 10) || t.createdDate
        } as Ticket;
      }),
      catchError(() => throwError(() => new Error('Ticket not found or API unavailable.')))
    );
  }

  createTicket(ticket: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets`, ticket);
  }

  updateTicket(id: string, ticket: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tickets/${id}`, ticket);
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tickets/${id}`);
  }

  getStats(): Observable<any> {
  return this.getTickets().pipe(
    map((tickets: Ticket[]) => {
      return {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open' || t.status === 'Open').length,
        closed: tickets.filter(t => t.status === 'closed' || t.status === 'Closed').length,
        high_priority: tickets.filter(t => t.priority === 'high' || t.priority === 'High').length
      };
    })
  );
}
}