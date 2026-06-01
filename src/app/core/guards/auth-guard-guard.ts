// auth-guard-guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthGuard = () => {
  const router = inject(Router);
  const user = localStorage.getItem('skyline_user');
  if (user) return true;
  return router.createUrlTree(['/authentication']);
};
