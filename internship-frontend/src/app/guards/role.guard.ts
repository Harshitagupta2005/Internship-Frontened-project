import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles: string[] = route.data['roles'] || [];
    const userRole = this.authService.getUserRole();

    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/access-denied']);
    return false;
  }
}