import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getCurrentUser,
  getCurrentUserFailure,
  getCurrentUserSuccess,
} from './auth.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { AccountService } from '../../services/account/account.service';

@Injectable()
export class AuthEffects {
  private action$ = inject(Actions);
  private accountService = inject(AccountService);

  getCurrentUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(getCurrentUser),
      switchMap(() =>
        this.accountService.getUserProfile().pipe(
          map((user) => getCurrentUserSuccess({ user })),
          catchError((error) => of(getCurrentUserFailure({ error })))
        )
      )
    )
  );
}
