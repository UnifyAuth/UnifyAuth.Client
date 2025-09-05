import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsChangingEmail } from '../store/account/account.selector';
import { map, take } from 'rxjs';

export const emailChangeGuard: CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsChangingEmail).pipe(
    map((isChangingEmail) => {
      return isChangingEmail == true
        ? true
        : router.createUrlTree(['/settings/change-email']);
    }),
    take(1)
  );
};
