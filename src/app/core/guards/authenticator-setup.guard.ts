import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsConfiguring } from '../store/TwoFA/two-fa.selector';
import { map, take } from 'rxjs';

export const authenticatorSetupGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsConfiguring).pipe(
    map((isConfiguring) => {
      return isConfiguring == true
        ? true
        : router.createUrlTree(['/settings/2fa']);
    }),
    take(1)
  );
};
