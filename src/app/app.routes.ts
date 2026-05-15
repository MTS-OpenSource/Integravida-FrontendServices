import { Routes } from '@angular/router';
import { LoginPage } from './account-management/presentation/login-page/login-page';
import { ForgetPassword } from './account-management/presentation/forget-password/forget-password';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./integravida/presentation/dashboard/dashboard.routes').then(
        (module) => module.DASHBOARD_ROUTES,
      ),
  },
  {
    path: 'login',
    component: LoginPage,
  },
  { path: 'forget', component: ForgetPassword },
  {
    path: 'glucose-monitoring',
    loadChildren: () =>
      import('./glucose-monitoring/presentation/glucose-monitoring.routes').then(
        (module) => module.GLUCOSE_MONITORING_ROUTES,
      ),
  },
];
