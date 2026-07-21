import { Routes } from '@angular/router';

export const ADMIN_USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-users').then((m) => m.AdminUsers),
  },
];
