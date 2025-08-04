import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/auth/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();

  if (accessToken) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
