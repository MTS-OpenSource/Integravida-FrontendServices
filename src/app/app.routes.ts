import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard-test',
    loadChildren: () =>
      import('./integravida/presentation/dashboard-test/dashboard-test.routes').then(
        (module) => module.DASHBOARD_TEST_ROUTES,
      ),
  },
];
