import { Routes } from '@angular/router';

export const ADMIN_ASSIGNMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-assignments').then((m) => m.AdminAssignments),
  },
];
