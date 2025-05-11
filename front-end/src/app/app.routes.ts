import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'signup-client',
        loadComponent: () =>
            import('./client-signup/client-signup.component').then((c) => c.ClientSignupComponent)
    },
    {
      path: '',
      loadComponent: () =>
        import('./client-appointment/client-appointment.component').then((c) => c.ClientAppointmentComponent)
    },
    {
      path: 'signup-doctor',
      loadComponent: () =>
        import('./doctor-signup/doctor-signup.component').then((c) => c.DoctorSignupComponent)
    },
    {
      path: 'login',
      loadComponent: () =>
        import('./login/login.component').then((c) => c.LoginComponent)
    },
    {
      path: 'dashboard-client',
      loadComponent: () =>
        import('./client-dashboard/dashboard-client.component').then((c) => c.DashboardClientComponent)
    }

];
