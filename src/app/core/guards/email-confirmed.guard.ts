import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectEmailConfirmed } from '../store/auth/auth.selector';
import { map, take } from 'rxjs';

export const emailConfirmedGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectEmailConfirmed).pipe(
    map((emailConfirmed) => {
      return emailConfirmed == true ? true : router.createUrlTree(['/profile']);
    }),
    take(1)
  );
};
