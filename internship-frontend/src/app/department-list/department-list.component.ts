import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../services/department.service';
import { Department } from '../models/department';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {

  departments: Department[] = [];
  isLoading = true;
  errorMessage = '';

  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.isLoading = true;
    this.errorMessage = '';

    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load departments. Please try again.';
        this.isLoading = false;
      }
    });
  }

  showNotif(type: 'success' | 'error' | 'warning', message: string) {
    this.notifType = type;
    this.notifMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}