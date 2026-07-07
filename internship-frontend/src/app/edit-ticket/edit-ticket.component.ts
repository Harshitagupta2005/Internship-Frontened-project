import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TicketService } from '../services/ticket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {

  ticketForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  ticketId = '';

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
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private userService: UserService,
    private http: HttpClient
  ) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assigned_to: ['', Validators.required],
      department_id: ['']
    });
  }

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUsers();
    this.loadDepartments();
    this.loadTicket();
  }

  loadTicket() {
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (data: any) => {
        this.ticketForm.patchValue({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          assigned_to: data.assignedToId || '',
          department_id: data.department_id || ''
        });
      },
      error: () => {
        this.notifType = 'error';
        this.notifMessage = 'Failed to load ticket data.';
        this.showNotification = true;
      }
    });
  }

  loadUsers() {
    this.isLoadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res;
        this.isLoadingUsers = false;
      },
      error: () => {
        this.isLoadingUsers = false;
      }
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
      this.notifMessage = 'Please fix the errors before submitting.';
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
      assigned_to: Number(this.ticketForm.value.assigned_to),
      department_id: Number(this.ticketForm.value.department_id) || null
    };

    this.ticketService.updateTicket(this.ticketId, formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notifType = 'success';
        this.notifMessage = 'Ticket updated successfully!';
        this.showNotification = true;
        setTimeout(() => this.router.navigate(['/tickets']), 1200);
      },
      error: (err: any) => {
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
      this.notifMessage = 'Failed to update ticket. Please try again.';
    }
    this.showNotification = true;
  }

  onCancel() {
    this.router.navigate(['/tickets']);
  }
}