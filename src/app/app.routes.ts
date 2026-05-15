import { Routes } from '@angular/router';
import { ForgetPassword } from './account-management/presentation/forget-password/forget-password';
import { authGuard } from './account-management/auth.guard';

/**
 * Main application routes.
 *
 * Each route loads the presentation routes of a bounded context.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./account-management/presentation/login-page/login-page').then(
        (module) => module.LoginPage,
      ),
  },
  {
    path: 'forget',
    component: ForgetPassword,
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./integravida/presentation/dashboard/dashboard.routes').then(
        (module) => module.DASHBOARD_ROUTES,
      ),
  },
  {
    path: 'patient-profile',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./patient-profile-management/presentation/patient-profile-management.routes').then(
        (module) => module.PATIENT_PROFILE_MANAGEMENT_ROUTES,
      ),
  },
  {
    path: 'appointments',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./appointment-management/presentation/appointment/appointment.routes').then(
        (module) => module.APPOINTMENT_ROUTES,
      ),
  },

  {
    path: 'glucose-log',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./glucose-monitoring/presentation/glucose-log/glucose-log.routes').then(
        (module) => module.GLUCOSE_LOG_ROUTES,
      ),
  },
  {
    path: 'health-history',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./glucose-monitoring/presentation/health-history/health-history.routes').then(
        (module) => module.HEALTH_HISTORY_ROUTES,
      ),
  },
  {
    path: 'alerts',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./integravida/presentation/alerts/alerts.routes').then(
        (module) => module.ALERTS_ROUTES,
      ),
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
