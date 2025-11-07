import { inject, Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, of, switchMap } from 'rxjs';
import { TokenService } from '../auth/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInitializerService {
  private tokenService = inject(TokenService);
  private initPromise: Promise<boolean> | null = null;

  // Runs once at application bootstrap to refresh access token if refresh cookie exists.
  init(): Promise<boolean> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = firstValueFrom(
      this.tokenService.hasRefreshCookie().pipe(
        switchMap((hasCookie) =>
          hasCookie
            ? this.tokenService.refreshAccessToken().pipe(
                map(() => true),
                catchError(() => of(false))
              )
            : of(false)
        ),
        catchError(() => of(false))
      )
    );
    return this.initPromise;
  }
}
