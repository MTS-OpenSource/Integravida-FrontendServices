import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard-test',
    loadChildren: () =>
      import('./integravida/presentation/dashboard-test/dashboard-test.routes').then(
        (module) => module.DASHBOARD_TEST_ROUTES,
      ),
  },
  {
    path: 'glucose-log',
    loadChildren: () =>
      import('./glucose-monitoring/presentation/glucose-log/glucose-log.routes').then(
        (module) => module.GLUCOSE_LOG_ROUTES,
      ),
  },
  {
    path: 'health-history',
    loadChildren: () =>
      import('./glucose-monitoring/presentation/health-history/health-history.routes').then(
        (module) => module.HEALTH_HISTORY_ROUTES,
      ),
  },
  {
    path: 'alerts',
    loadChildren: () =>
      import('./integravida/presentation/alerts/alerts.routes').then(
        (module) => module.ALERTS_ROUTES,
      ),
  },
];
