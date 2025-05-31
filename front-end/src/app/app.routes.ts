import { Routes } from '@angular/router';
import { RoleGuard } from './utils/role-guard';
import { Roles } from './models/roles';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/login/login.component').then((c) => c.LoginComponent)
  },
  {
    path: 'payment-system',
    loadComponent: () =>
      import('./shared/payment-system/payment-system.component').then((c) => c.PaymentSystemComponent)
  },
  {
    path: 'signup-client',
    loadComponent: () =>
      import('./client/client-signup/client-signup.component').then((c) => c.ClientSignupComponent)
  },
  {
    path: 'signup-doctor',
    loadComponent: () =>
      import('./doctor/doctor-signup/doctor-signup.component').then((c) => c.DoctorSignupComponent)
  },

  {
    path:'book-appointment',
    loadComponent: () =>
      import('./client/client-appointment/client-appointment.component').then((c) => c.ClientAppointmentComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_PATIENT }
  },
  {
    path: 'dashboard-client',
    loadComponent: () =>
      import('./client/client-dashboard/dashboard-client.component').then((c) => c.DashboardClientComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_PATIENT }
  },
  {
    path: 'edit-profile',
    loadComponent: () =>
      import('./client/client-update/client-update.component').then((c) => c.ClientUpdateComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_PATIENT }
  },
  {
    path: 'dashboard-doctor',
    loadComponent: () =>
      import('./doctor/doctor-dashboard/doctor-dashboard.component').then((c) => c.DoctorDashboardComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_DOCTOR }
  },
  {
    path: 'edit-profile-doctor',
    loadComponent: () =>
      import('./doctor/doctor-update/doctor-update.component').then((c) => c.DoctorUpdateComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_DOCTOR }
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/unauthorized/unauthorized.component').then((c) => c.UnauthorizedComponent),
  }
];
