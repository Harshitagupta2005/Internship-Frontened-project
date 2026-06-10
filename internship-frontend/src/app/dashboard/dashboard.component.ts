import { Component } from '@angular/core';

@Component({ selector:'app-dashboard', templateUrl:'./dashboard.component.html', styleUrls:['./dashboard.component.css'] })
export class DashboardComponent {
  cards = [
    { label: 'Total Users', value: '1,240', icon: '👥', color: '#1D9E75' },
    { label: 'Open Tickets', value: '45', icon: '🎫', color: '#e67e22' },
    { label: 'Closed Tickets', value: '312', icon: '✅', color: '#3498db' },
    { label: 'Departments', value: '8', icon: '🏢', color: '#9b59b6' }
  ];
}