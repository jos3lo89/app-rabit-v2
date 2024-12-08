import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RolesService } from 'src/app/shared/services/roles.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RolesService);
  const requiredRole = route.data?.['requiredRole'] as string;
  const router = inject(Router)

  const userRole = roleService.getRole();

  if (userRole === requiredRole) {
    return true;
  } else {
    router.navigateByUrl("/private/profile")
    return false;
  }
};
