import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/auth/token.service';
import {
  catchError,
  finalize,
  Observable,
  shareReplay,
  switchMap,
  take,
  throwError,
} from 'rxjs';

let refresh$: Observable<string> | null = null;

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();

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
          shareReplay(1),
          finalize(() => {
            refresh$ = null;
          })
        );
      }

      return refresh$.pipe(
        take(1),
        switchMap((newAccessToken) => {
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` },
          });
          return next(retryReq);
        }),
        catchError((refreshErr) => {
          tokenService.clearAccessToken();
          return throwError(() => refreshErr);
        })
      );
    })
  );
};
