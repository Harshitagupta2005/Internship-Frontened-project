import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit {
  ticketForm: FormGroup;
  submitted = false;
  isSubmitting = false;

  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  statusOptions = ['open', 'in_progress', 'closed'];
  priorityOptions = ['high', 'medium', 'low'];

  users: {id: number, name: string}[] = [];
  departments: {id: number, name: string}[] = [];
  isLoadingUsers = true;
  isLoadingDepts = true;

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ticketService: TicketService,
    private http: HttpClient
  ) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assigned_to: ['', Validators.required],
      department_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadDepartments();
  }

  loadUsers() {
    this.http.get<any>(`${this.apiUrl}/users`).subscribe({
      next: (res) => {
        this.users = (res.data || res || []).map((u: any) => ({
          id: u.id,
          name: u.name
        }));
        this.isLoadingUsers = false;
      },
      error: () => { this.isLoadingUsers = false; }
    });
  }

  loadDepartments() {
    this.http.get<any>(`${this.apiUrl}/departments`).subscribe({
      next: (res) => {
        const depts = res.data || res || [];
        const seen = new Set<string>();
        this.departments = depts.filter((d: any) => {
          if (seen.has(d.name)) return false;
          seen.add(d.name);
          return true;
        }).map((d: any) => ({ id: d.id, name: d.name }));
        this.isLoadingDepts = false;
      },
      error: () => { this.isLoadingDepts = false; }
    });
  }

  get f() { return this.ticketForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.ticketForm.invalid) {
      this.notifType = 'error';
      this.notifMessage = 'Please fill all required fields correctly.';
      this.showNotification = true;
      return;
    }

    this.isSubmitting = true;
    this.showNotification = false;

    const formData = {
      title: this.ticketForm.value.title,
      description: this.ticketForm.value.description,
      status: this.ticketForm.value.status,
      priority: this.ticketForm.value.priority,
      user_id: Number(this.ticketForm.value.assigned_to),
      assigned_to: Number(this.ticketForm.value.assigned_to),
      department_id: Number(this.ticketForm.value.department_id)
    };

    this.ticketService.createTicket(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notifType = 'success';
        this.notifMessage = 'Ticket added successfully!';
        this.showNotification = true;
        setTimeout(() => this.router.navigate(['/tickets']), 1200);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.handleBackendErrors(err);
      }
    });
  }

  handleBackendErrors(err: any) {
    if (err.error && err.error.errors) {
      const backendErrors = err.error.errors;
      Object.keys(backendErrors).forEach(field => {
        const control = this.ticketForm.get(field);
        if (control) {
          control.setErrors({ backend: backendErrors[field][0] });
        }
      });
      this.notifType = 'error';
      this.notifMessage = 'Please fix the errors below.';
    } else {
      this.notifType = 'error';
      this.notifMessage = 'Failed to add ticket. Please try again.';
    }
    this.showNotification = true;
  }

  onCancel() {
    this.router.navigate(['/tickets']);
  }
}