import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // GET ALL DEPARTMENTS
  getDepartments(): Observable<Department[]> {
    return this.http.get<any>(`${this.apiUrl}/departments`).pipe(
      map((res: any) => {
        const list = res.data || res;
        return list.map((d: any) => ({
          id: d.id,
          name: d.name,
          head: d.head?.name || d.department_head?.name || d.head_name || '',
          headId: d.head?.id || d.head_id || '',
          employeeCount: d.employees_count ?? d.employee_count ?? d.employees?.length ?? 0
        }));
      }),
      catchError(() =>
        throwError(() => new Error('Failed to load departments'))
      )
    );
  }

  // CREATE DEPARTMENT
  addDepartment(department: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/departments`, department);
  }
}