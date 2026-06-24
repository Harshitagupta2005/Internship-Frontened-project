import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // GET ALL USERS (for assign dropdown)
  getUsers(): Observable<User[]> {
    return this.http.get<any>(`${this.apiUrl}/users`).pipe(
      map((res: any) => {
        const list = res.data || res;
        return list.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role
        }));
      }),
      catchError(() =>
        throwError(() => new Error('Failed to load users'))
      )
    );
  }

  // ADD NEW USER
  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user).pipe(
      catchError(() =>
        throwError(() => new Error('Failed to add user'))
      )
    );
  }
}