import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
  ticketForm: FormGroup;
  submitted = false;
  ticketId = '';

  statusOptions = ['Open', 'In Progress', 'Closed'];
  priorityOptions = ['High', 'Medium', 'Low'];
  assigneeOptions = ['Harshita Gupta', 'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Sneha Gupta'];

  tickets: any[] = [
    { id: 'TKT-001', title: 'Login page not working', description: 'Users are unable to login with correct credentials.', status: 'Open', priority: 'High', assignedTo: 'Rahul Sharma' },
    { id: 'TKT-002', title: 'Dashboard data not loading', description: 'Dashboard shows blank screen after login.', status: 'In Progress', priority: 'Medium', assignedTo: 'Priya Singh' },
    { id: 'TKT-003', title: 'Profile photo upload fails', description: 'Upload button does not respond on click.', status: 'Closed', priority: 'Low', assignedTo: 'Amit Kumar' },
    { id: 'TKT-004', title: 'Email notifications not sent', description: 'Users not receiving email alerts.', status: 'Open', priority: 'High', assignedTo: 'Sneha Gupta' },
    { id: 'TKT-005', title: 'Password reset broken', description: 'Reset link in email is expired immediately.', status: 'In Progress', priority: 'High', assignedTo: 'Harshita Gupta' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assignedTo: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('id') || 'TKT-001';
    const ticket = this.tickets.find(t => t.id === this.ticketId);
    if (ticket) {
      this.ticketForm.patchValue(ticket);
    }
  }

  get f() { return this.ticketForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.ticketForm.invalid) return;
    alert('Ticket updated successfully!');
    this.router.navigate(['/tickets']);
  }

  onCancel() {
    this.router.navigate(['/tickets']);
  }
}