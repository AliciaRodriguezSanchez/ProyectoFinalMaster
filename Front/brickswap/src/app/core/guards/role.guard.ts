// core/guards/role.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_NAVIGATION_PATHS, UserRole } from '../constants/user-role';
import { decodeJwtPayload } from '../utils/jwt';
import { TOKEN_KEY } from '../constants/auth';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return router.createUrlTree([APP_NAVIGATION_PATHS.login]);
  }

  try {
    const payload = decodeJwtPayload<{ role: UserRole }>(token);

    const userRole = Number(payload.role) as UserRole;
    const allowedRoles = route.data['roles'] as UserRole[];

    if (!allowedRoles.includes(userRole)) {
      return router.createUrlTree([APP_NAVIGATION_PATHS.home]);
    }

    return true;
  } catch {
    return router.createUrlTree([APP_NAVIGATION_PATHS.login]);
  }
};
