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
    }

];
