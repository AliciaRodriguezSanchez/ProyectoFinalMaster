// core/guards/role.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../constants/user-role';
import { decodeJwtPayload } from '../utils/jwt';
import { TOKEN_KEY } from '../constants/auth';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const payload = decodeJwtPayload<{ role: UserRole }>(token);

    const userRole = Number(payload.role) as UserRole;
    const allowedRoles = route.data['roles'] as UserRole[];

    const ADMIN_ROLE_ID = 3;
    if (userRole === ADMIN_ROLE_ID) {
      return true;
    }

    if (!allowedRoles.includes(userRole)) {
      return router.createUrlTree(['/home']);
    }

    return true;
  } catch {
    return router.createUrlTree(['/login']);
  }
};
