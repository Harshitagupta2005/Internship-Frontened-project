import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  features = [
    {
      icon: '🎫',
      title: 'Ticket Management',
      desc: 'Create, assign, track and resolve support tickets efficiently with full lifecycle management.'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      desc: 'Real-time charts and stats showing ticket distribution by status and department.'
    },
    {
      icon: '👥',
      title: 'User Management',
      desc: 'Manage users with role-based access control — Admin, Manager, and Employee roles.'
    },
    {
      icon: '🏢',
      title: 'Department Management',
      desc: 'Organize tickets by departments and track workload across teams.'
    },
    {
      icon: '📋',
      title: 'Reports & Export',
      desc: 'Generate filtered reports and export them as CSV or PDF with applied filters.'
    },
    {
      icon: '🔔',
      title: 'Email Notifications',
      desc: 'Stay updated with configurable email notifications for ticket events.'
    }
  ];

  stats = [
    { value: '3', label: 'User Roles' },
    { value: '15+', label: 'Features Built' },
    { value: '20+', label: 'API Endpoints' },
    { value: '100%', label: 'Responsive' }
  ];

  techStack = [
    { name: 'Angular 17', icon: '🔺' },
    { name: 'TypeScript', icon: '🔷' },
    { name: 'Chart.js', icon: '📈' },
    { name: 'Laravel', icon: '🐘' },
    { name: 'MySQL', icon: '🗄️' },
    { name: 'REST APIs', icon: '🔌' }
  ];

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}