import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/auth/token.service';
import {
  catchError,
  EMPTY,
  finalize,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';

let refresh$: Observable<string> | null = null;
let navigatingToLogin = false; // avoid multiple parallel navigations after a single refresh failure

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();
  const router = inject(Router);

  if (req.url.includes('/refresh-token')) {
    // If the request is for refreshing the token, skip adding the Authorization header
    return next(req);
  }
  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      if (!refresh$) {
        refresh$ = tokenService.refreshAccessToken().pipe(
          finalize(() => {
            // defer null reset until next event loop tick
            // (so late subscribers in the same tick can still reuse this refresh$)
            setTimeout(() => {
              refresh$ = null;
            }, 0);
          }),
          shareReplay({ bufferSize: 1, refCount: true }) // share one refresh call among subscribers, auto-unsubscribe when no one is listening
        );
      }

      return refresh$.pipe(
        take(1),
        // Just catch refresh-token error
        catchError(() => {
          // Refresh attempt failed: clear token and trigger a single redirect.
          tokenService.clearAccessToken();
          if (!navigatingToLogin) {
            navigatingToLogin = true;
            // Trigger navigation explicitly because the auth guard only runs on navigations.
            router
              .navigate(['/login'])
              .finally(() => (navigatingToLogin = false));
          }
          return EMPTY; // swallow to prevent further error propagation; route change handles auth flow
        }),
        // if refresh-token was successful
        switchMap((newAccessToken) => {
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` },
          });
          return next(retryReq);
        })
      );
    })
  );
};
