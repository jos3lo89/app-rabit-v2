import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.authState$.pipe(
      map((state) => {
        console.log('estado del auth', state);

        if (!state) {
          router.navigateByUrl('/auth/login');
          return false;
        }

        return true;
      })
    );
  };
};
