import { inject, Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { catchError, firstValueFrom, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthInitializerService {
  private tokenService = inject(TokenService);
  private initialized = false;

  // Runs once at application bootstrap to refresh access token if refresh cookie exists.
  init(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }

    this.initialized = true;
    return firstValueFrom(
      this.tokenService.hasRefreshCookie().pipe(
        switchMap((hasCookie) =>
          hasCookie
            ? this.tokenService
                .refreshAccessToken()
                .pipe(catchError(() => of(null)))
            : of(null)
        ),
        catchError(() => of(void 0))
      )
    ).then(() => void 0);
  }
}
