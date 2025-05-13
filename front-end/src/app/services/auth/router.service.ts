import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router) {}

  routeUserByRole(role: string): void {
    switch (role) {
      case 'ROLE_CLIENT':
        this.router.navigate(['/dashboard-client']);
        break;
      case 'ROLE_DOCTOR':
        this.router.navigate(['/dashboard-doctor']);
        break;
      case 'ROLE_ADMIN':
        this.router.navigate(['/dashboard-admin']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
