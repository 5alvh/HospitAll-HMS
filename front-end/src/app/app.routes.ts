import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role-guard';
import { Roles } from './models/roles';

export const routes: Routes = [
  //signup - login routes
  {
    path: 'login',
    loadComponent: () =>
      import('./shared/login/login.component').then((c) => c.LoginComponent)
  },
  {
    path: 'signup-client',
    loadComponent: () =>
      import('./client/components/signup/client-signup.component').then((c) => c.ClientSignupComponent)
  },
  {
    path: 'signup-doctor',
    loadComponent: () =>
      import('./doctor/doctor-signup/doctor-signup.component').then((c) => c.DoctorSignupComponent)
  },
  //client routes
  {
    path: 'dashboard-client',
    loadComponent: () =>
      import('./client/components/dashboard/dashboard-client.component').then((c) => c.DashboardClientComponent),
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
          import('./client/components/dashboard/client-dashboard-summary/client-dashboard-summary.component').then((c) => c.ClientDashboardSummaryComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./client/components/dashboard/client-profile/client-profile.component').then((c) => c.ClientProfileComponent),
        children: [
          {
            path: 'edit-profile',
            loadComponent: () =>
              import('./client/components/dashboard/client-profile/edit-profile/edit-profile.component').then((c) => c.EditProfileComponent)
          }
        ]
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./client/components/dashboard/client-appointments/client-appointments.component').then((c) => c.ClientAppointmentsComponent),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: '/dashboard-client/appointments/upcoming'
          },
          {
            path: 'upcoming',
            loadComponent: () =>
              import('./client/components/dashboard/client-appointments/upcoming/upcoming.component').then((c) => c.UpcomingComponent),
          },
          {
            path: 'history',
            loadComponent: () =>
              import('./client/components/dashboard/client-appointments/history/history.component').then((c) => c.HistoryComponent),
          },
        ]
      },
      {
        path: 'records',
        loadComponent: () =>
          import('./client/components/dashboard/client-prescriptions/client-prescriptions.component').then((c) => c.ClientPrescriptionsComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./client/components/dashboard/client-notifications/client-notifications.component').then((c) => c.ClientNotificationsComponent),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./client/components/dashboard/client-documents/client-documents.component').then((c) => c.ClientDocumentsComponent),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./client/components/dashboard/client-feedback/client-feedback.component').then((c) => c.ClientFeedbackComponent),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./client/components/dashboard/client-support/client-support.component').then((c) => c.ClientSupportComponent),
      },
    ]
  },
  {
    path: 'book-appointment',
    loadComponent: () =>
      import('./client/components/client-appointment/client-appointment.component').then((c) => c.ClientAppointmentComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_PATIENT }
  },
  {
    path: 'edit-profile',
    loadComponent: () =>
      import('./client/components/client-update/client-update.component').then((c) => c.ClientUpdateComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_PATIENT }
  },
  //doctors routes
  {
    path: 'dashboard-doctor',
    loadComponent: () =>
      import('./doctor/doctor-dashboard/doctor-dashboard.component').then((c) => c.DoctorDashboardComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: Roles.ROLE_DOCTOR },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard-doctor/summary'
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./doctor/doctor-dashboard/profile/profile.component').then((c) => c.ProfileComponent),
      },
      {
        path: 'summary',
        loadComponent: () =>
          import('./doctor/doctor-dashboard/dashboard-summary/dashboard-summary.component').then((c) => c.DashboardSummaryComponent),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./doctor/doctor-dashboard/patients/patients.component').then((c) => c.PatientsComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./doctor/doctor-dashboard/calendar/calendar.component').then((c) => c.CalendarComponent),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./doctor/doctor-dashboard/appointment-list/appointment-list.component').then((c) => c.AppointmentListComponent),
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import('./doctor/doctor-dashboard/prescriptions/prescriptions.component').then((c) => c.PrescriptionsComponent),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./doctor/doctor-dashboard/feedback/feedback.component').then((c) => c.FeedbackComponent),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./doctor/doctor-dashboard/support/support.component').then((c) => c.SupportComponent),
      },
    ]
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
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/unauthorized/unauthorized.component').then((c) => c.UnauthorizedComponent),
  },
  {
    path: '**',
    redirectTo: '/login'
  },
];
