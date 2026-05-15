import { Routes } from '@angular/router';

import { AppointmentComponent } from './appointment';

/**
 * Defines the routes for the Appointment Management bounded context.
 *
 * This route connects the appointment presentation component with Angular Router.
 */
export const APPOINTMENT_ROUTES: Routes = [
  {
    path: '',
    component: AppointmentComponent,
  },
];
