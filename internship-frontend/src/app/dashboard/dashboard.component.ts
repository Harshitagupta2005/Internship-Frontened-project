import { Component } from '@angular/core';
@Component({ selector:'app-dashboard', templateUrl:'./dashboard.component.html', styleUrls:['./dashboard.component.css'] })
export class DashboardComponent {
  stats = [
    { label: 'Tasks Completed', value: '24', icon: '✅', color: '#1D9E75' },
    { label: 'Days Active', value: '15', icon: '📅', color: '#3498db' },
    { label: 'Components Built', value: '6', icon: '📦', color: '#9b59b6' },
    { label: 'Commits Made', value: '8', icon: '🔀', color: '#e67e22' }
  ];
  activities = [
    { text: 'Created Header, Footer, Home components', time: 'Today', icon: '📦' },
    { text: 'Configured Angular Routing', time: 'Today', icon: '🗺️' },
    { text: 'Added Dashboard, Profile, Contact pages', time: 'Today', icon: '📄' },
    { text: 'Made app mobile responsive', time: 'Today', icon: '📱' },
    { text: 'Pushed code to GitHub', time: 'Yesterday', icon: '🚀' }
  ];
}