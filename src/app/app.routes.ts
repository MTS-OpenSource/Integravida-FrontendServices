import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./account-management/presentation/login/login').then((module) => module.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./account-management/presentation/register/register').then(
        (module) => module.Register,
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./integravida/presentation/dashboard/dashboard.routes').then(
        (module) => module.DASHBOARD_ROUTES,
      ),
  },
  {
    path: 'patient-profile',
    loadChildren: () =>
      import('./patient-profile-management/presentation/patient-profile-management.routes').then(
        (module) => module.PATIENT_PROFILE_MANAGEMENT_ROUTES,
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
