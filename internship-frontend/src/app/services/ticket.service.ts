import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // GET ALL TICKETS WITH PAGINATION
  // GET ALL TICKETS WITH PAGINATION + DEPARTMENT FILTER
getTickets(page: number = 1, departmentId: string = ''): Observable<any> {

  let url = `${this.apiUrl}/tickets?page=${page}&per_page=10`;

  if (departmentId) {
    url += `&department_id=${departmentId}`;
  }

  return this.http.get<any>(url).pipe(
    map((res: any) => {
      return {
        ...res,
        data: (res.data || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          department: t.department?.name || '',
          department_id: t.department?.id || '',
          assignedTo:
            t.assigned_to?.name ||
            t.assignedTo?.name ||
            t.assigned_to_name ||
            'Unassigned',
          assignedToId: t.assigned_to?.id || '',
          createdDate: t.created_at
            ? t.created_at.substring(0, 10)
            : ''
        }))
      };
    }),
    catchError(() => throwError(() => new Error('API unavailable')))
  );
}

  // GET SINGLE TICKET
  getTicketById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/${id}`).pipe(
      map((res: any) => {
        const t = res.data || res;
        return {
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,

          assignedToId: t.assigned_to?.id || '',
          assignedTo: t.assigned_to?.name || 'Unassigned',
          createdDate: t.created_at ? t.created_at.substring(0, 10) : ''
        };
      }),
      catchError(() => throwError(() => new Error('Ticket not found')))
    );
  }

  // CREATE TICKET
  createTicket(ticket: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets`, ticket);
  }

  // UPDATE TICKET
  updateTicket(id: string, ticket: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tickets/${id}`, ticket).pipe(
      catchError(() => throwError(() => new Error('Update failed')))
    );
  }

  // ASSIGN TICKET
  assignTicket(id: string, assignedTo: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/tickets/${id}/assign`,
      { assigned_to: assignedTo }
    ).pipe(
      catchError(() => throwError(() => new Error('Failed to assign ticket')))
    );
  }

  // UPDATE STATUS
  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/tickets/${id}/status`,
      { status: status }
    ).pipe(
      catchError(() => throwError(() => new Error('Failed to update status')))
    );
  }

  // DELETE TICKET
  deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tickets/${id}`).pipe(
      catchError(() => throwError(() => new Error('Delete failed')))
    );
  }

  // GET STATS — ab saare pages fetch karke combine karta hai,
  // isliye backend agar per_page ko limit/ignore kare tab bhi counts sahi aayenge
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets?page=1&per_page=100`).pipe(
      switchMap((firstRes: any) => {
        const lastPage = firstRes.meta?.last_page || 1;

        // Agar sirf 1 page hi hai to seedha use karo
        if (lastPage <= 1) {
          return of([...(firstRes.data || [])]);
        }

        // Page 2 se lastPage tak baaki requests banao
        const remainingRequests = [];
        for (let p = 2; p <= lastPage; p++) {
          remainingRequests.push(
            this.http.get<any>(`${this.apiUrl}/tickets?page=${p}&per_page=100`)
          );
        }

        return forkJoin(remainingRequests).pipe(
          map((responses: any[]) => {
            let allTickets = [...(firstRes.data || [])];
            responses.forEach((r: any) => {
              allTickets = allTickets.concat(r.data || []);
            });
            return allTickets;
          })
        );
      }),
      map((tickets: any[]) => {
        const open = tickets.filter((t: any) =>
          ['open', 'Open'].includes(t.status)).length;
        const in_progress = tickets.filter((t: any) =>
          ['in_progress', 'In Progress', 'in progress',
           'In_progress', 'InProgress'].includes(t.status)).length;
        const closed = tickets.filter((t: any) =>
          ['closed', 'Closed'].includes(t.status)).length;

        return {
          total: tickets.length,
          open: open,
          in_progress: in_progress,
          closed: closed,
          high_priority: tickets.filter((t: any) =>
            ['high', 'High'].includes(t.priority)).length,
        };
      }),
      catchError(() => throwError(() => new Error('Stats unavailable')))
    );
  }

  // RECENT TICKETS
  getRecentTickets(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/tickets?page=1&per_page=5`).pipe(
      map((res: any) => (res.data || []).slice(0, 5).map((t: any) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        createdDate: t.created_at ? t.created_at.substring(0, 10) : ''
      }))),
      catchError(() => throwError(() => new Error('Failed to load recent tickets')))
    );
  }
}