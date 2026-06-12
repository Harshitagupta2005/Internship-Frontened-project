import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent {
  ticketForm: FormGroup;
  submitted = false;

  statusOptions = ['Open', 'In Progress', 'Closed'];
  priorityOptions = ['High', 'Medium', 'Low'];
  assigneeOptions = ['Harshita Gupta', 'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Sneha Gupta'];

  constructor(private fb: FormBuilder, private router: Router) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assignedTo: ['', Validators.required]
    });
  }

  get f() { return this.ticketForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.ticketForm.invalid) return;
    alert('Ticket added successfully!');
    this.router.navigate(['/tickets']);
  }

  onCancel() {
    this.router.navigate(['/tickets']);
  }
}