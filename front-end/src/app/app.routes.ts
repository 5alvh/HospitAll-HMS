import { Routes } from '@angular/router';
import { RoleGuard } from './utils/role-guard';
import { Roles } from './models/roles';

export const routes: Routes = [
  //signup - login routes
  {
    path: '',
    loadComponent: () =>
      import('./shared/login/login.component').then((c) => c.LoginComponent)
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
  //client routes

  {
    path: 'edit-profile',
    loadComponent: () =>
      import('./client/client-update/client-update.component').then((c) => c.ClientUpdateComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_PATIENT }
  },
  {
    path: 'dashboard-client',
    loadComponent: () =>
      import('./client/client-dashboard/dashboard-client.component').then((c) => c.DashboardClientComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_PATIENT },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard-client/summary'
      },
      {
        path: 'summary',
        loadComponent: () =>
          import('./client/client-dashboard/client-dashboard-summary/client-dashboard-summary.component').then((c) => c.ClientDashboardSummaryComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./client/client-dashboard/client-profile/client-profile.component').then((c) => c.ClientProfileComponent),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./client/client-dashboard/client-appointments/client-appointments.component').then((c) => c.ClientAppointmentsComponent),
      },
      {
        path: 'records',
        loadComponent: () =>
          import('./client/client-dashboard/client-prescriptions/client-prescriptions.component').then((c) => c.ClientPrescriptionsComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./client/client-dashboard/client-notifications/client-notifications.component').then((c) => c.ClientNotificationsComponent),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./client/client-dashboard/client-documents/client-documents.component').then((c) => c.ClientDocumentsComponent),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./client/client-dashboard/client-feedback/client-feedback.component').then((c) => c.ClientFeedbackComponent),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./client/client-dashboard/client-support/client-support.component').then((c) => c.ClientSupportComponent),
      },
    ]
  },
  
  {
    path: 'book-appointment',
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
  //doctors routes
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
  //password recovery routes
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./shared/password-recover/password-recover.component').then((c) => c.PasswordRecoverComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./shared/reset-password/reset-password.component').then((c) => c.ResetPasswordComponent)
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
  },
  {
    path: 'hello',
    loadComponent: () =>
      import('./interface/interface.component').then((c) => c.InterfaceComponent)
  }
];
