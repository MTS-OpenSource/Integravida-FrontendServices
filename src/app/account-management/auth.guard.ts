import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from './application/auth.store';
import { UserRole } from './domain/model/user.entity';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};

export const roleGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser();
  if (!user) {
    return router.parseUrl('/login');
  }

  const allowedRoles = route.data?.['roles'] as UserRole[] | undefined;
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return router.parseUrl('/dashboard');
  }

  return true;
};
