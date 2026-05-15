import { Routes } from '@angular/router';
import { LoginPage } from './account-management/presentation/login-page/login-page';
import { ForgetPassword } from './account-management/presentation/forget-password/forget-password';

export const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'forget', component: ForgetPassword },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./integravida/presentation/dashboard-test/dashboard-test.routes').then(
        (m) => m.DASHBOARD_TEST_ROUTES,
      ),
  },
];
