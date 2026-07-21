import { Routes } from '@angular/router';
import { ForgetPassword } from './account-management/presentation/forget-password/forget-password';
import { authGuard, roleGuard } from './account-management/auth.guard';

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
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient', 'Doctor', 'Admin'] },
    loadChildren: () =>
      import('./integravida/presentation/dashboard/dashboard.routes').then(
        (module) => module.DASHBOARD_ROUTES,
      ),
  },
  {
    path: 'patient-profile',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient'] },
    loadChildren: () =>
      import('./patient-profile-management/presentation/patient-profile-management.routes').then(
        (module) => module.PATIENT_PROFILE_MANAGEMENT_ROUTES,
      ),
  },
  {
    path: 'appointments',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient', 'Doctor', 'Admin'] },
    loadChildren: () =>
      import('./appointment-management/presentation/appointment/appointment.routes').then(
        (module) => module.APPOINTMENT_ROUTES,
      ),
  },
  {
    path: 'glucose-log',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient'] },
    loadChildren: () =>
      import('./glucose-monitoring/presentation/glucose-log/glucose-log.routes').then(
        (module) => module.GLUCOSE_LOG_ROUTES,
      ),
  },
  {
    path: 'health-history',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient'] },
    loadChildren: () =>
      import('./glucose-monitoring/presentation/health-history/health-history.routes').then(
        (module) => module.HEALTH_HISTORY_ROUTES,
      ),
  },
  {
    path: 'alerts',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient'] },
    loadChildren: () =>
      import('./integravida/presentation/alerts/alerts.routes').then(
        (module) => module.ALERTS_ROUTES,
      ),
  },
  {
    path: 'adverse-effects',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient'] },
    loadChildren: () =>
      import('./integravida/presentation/adverse-effects/adverse-effects.routes').then(
        (module) => module.ADVERSE_EFFECTS_ROUTES,
      ),
  },
  {
    path: 'glucose-monitoring',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient'] },
    loadChildren: () =>
      import('./glucose-monitoring/presentation/glucose-monitoring.routes').then(
        (module) => module.GLUCOSE_MONITORING_ROUTES,
      ),
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () =>
      import('./admin/presentation/admin-dashboard/admin-dashboard.routes').then(
        (module) => module.ADMIN_DASHBOARD_ROUTES,
      ),
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () =>
      import('./admin/presentation/admin-users/admin-users.routes').then(
        (module) => module.ADMIN_USERS_ROUTES,
      ),
  },
  {
    path: 'doctor/patients',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Doctor'] },
    loadChildren: () =>
      import('./doctor/presentation/doctor-patients/doctor-patients.routes').then(
        (module) => module.DOCTOR_PATIENTS_ROUTES,
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
