// core/guards/role.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../constants/user-role';
import { decodeJwtPayload } from '../utils/jwt';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const payload = decodeJwtPayload<{ role: UserRole }>(token);

    const userRole = Number(payload.role) as UserRole;
    const allowedRoles = route.data['roles'] as UserRole[];

    if (!allowedRoles.includes(userRole)) {
      return router.createUrlTree(['/unauthorized']);
    }

    return true;
  } catch {
    return router.createUrlTree(['/login']);
  }
};
