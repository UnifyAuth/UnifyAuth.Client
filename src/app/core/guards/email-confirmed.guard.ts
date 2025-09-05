import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectEmailConfirmed, selectUser } from '../store/auth/auth.selector';
import { map, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const emailConfirmedGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return store.select(selectEmailConfirmed).pipe(
    map((emailConfirmed) => {
      return emailConfirmed == true
        ? true
        : (toastr.error('Email not confirmed. First confirm your email'),
          router.createUrlTree(['/profile']));
    }),
    take(1)
  );
};
