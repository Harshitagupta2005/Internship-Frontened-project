import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../services/department.service';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {

  departmentForm: FormGroup;
  submitted = false;
  isSubmitting = false;

  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {}

  get f() {
    return this.departmentForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.departmentForm.invalid) {
      this.notifType = 'error';
      this.notifMessage = 'Please fix the errors before submitting.';
      this.showNotification = true;
      return;
    }

    this.isSubmitting = true;
    this.showNotification = false;

    this.departmentService.addDepartment(this.departmentForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notifType = 'success';
        this.notifMessage = 'Department added successfully!';
        this.showNotification = true;

        setTimeout(() => {
          this.router.navigate(['/departments']);
        }, 1200);
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
        const control = this.departmentForm.get(field);
        if (control) {
          control.setErrors({ backend: backendErrors[field][0] });
        }
      });

      this.notifType = 'error';
      this.notifMessage = 'Please fix the errors below.';
    } else {
      this.notifType = 'error';
      this.notifMessage = 'Failed to add department. Please try again.';
    }

    this.showNotification = true;
  }

  onCancel() {
    this.router.navigate(['/departments']);
  }
}