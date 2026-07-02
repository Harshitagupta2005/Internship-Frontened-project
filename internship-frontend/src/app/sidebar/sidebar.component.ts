import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  userRole: string = 'employee';
  userName: string = '';
  userRoleLabel: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.userRole = user?.role || 'employee';
    this.userName = user?.name || 'User';
    this.userRoleLabel = this.getRoleLabel(this.userRole);
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'employee': return 'Employee';
      default: return role;
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  // Role check helpers
  isAdmin(): boolean { return this.userRole === 'admin'; }
  isManager(): boolean { return this.userRole === 'manager'; }
  isEmployee(): boolean { return this.userRole === 'employee'; }
  isAdminOrManager(): boolean { return ['admin', 'manager'].includes(this.userRole); }
}