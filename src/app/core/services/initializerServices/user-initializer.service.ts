import { inject, Injectable } from '@angular/core';
import { AccountService } from '../account/account.service';
import { Store } from '@ngrx/store';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { loginSuccess } from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class UserInitializerService {
  private accountService = inject(AccountService);
  private store = inject(Store);
  private initPromise: Promise<void> | null = null;

  init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = firstValueFrom(
      this.accountService.getUserProfile().pipe(
        tap((user) => {
          this.store.dispatch(loginSuccess({ user }));
        }),
        catchError(() => of(null))
      )
    ).then(() => void 0);

    return this.initPromise;
  }
}
