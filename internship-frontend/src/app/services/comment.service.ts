import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = ' https://internship-backend-production.up.railway.app/api';

  constructor(private http: HttpClient) {}

  // GET ALL COMMENTS FOR A TICKET
  getComments(ticketId: string): Observable<Comment[]> {
    return this.http.get<any>(`${this.apiUrl}/tickets/${ticketId}/comments`).pipe(
      map((res: any) => {
        const list = res.data || res;
        return list.map((c: any) => ({
          id: c.id,
          commentedBy:
            c.user?.name
            || c.commented_by?.name
            || c.author?.name
            || 'Unknown',
          comment: c.comment || c.body || c.message || '',
          createdAt: c.created_at || ''
        }));
      }),
      catchError(() =>
        throwError(() => new Error('Failed to load comments'))
      )
    );
  }

  // ADD A NEW COMMENT
  addComment(ticketId: string, comment: string): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/tickets/${ticketId}/comments`,
    { body: comment }   // 👈 'comment' se 'body' kiya
  ).pipe(
    catchError(() =>
      throwError(() => new Error('Failed to add comment'))
    )
  );
}
}