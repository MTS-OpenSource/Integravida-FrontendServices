import { Routes } from '@angular/router';

/**
 * Main application routes.
 *
 * Each route loads the presentation routes of a bounded context.
 */
export const routes: Routes = [
  {
    path: 'dashboard-test',
    loadChildren: () =>
      import('./integravida/presentation/dashboard-test/dashboard-test.routes').then(
        (module) => module.DASHBOARD_TEST_ROUTES,
      ),
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('./appointment-management/presentation/appointment/appointment.routes').then(
        (module) => module.APPOINTMENT_ROUTES,
      ),
  },
];
