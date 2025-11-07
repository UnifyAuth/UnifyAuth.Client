import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { catchError, firstValueFrom, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CookieDetectInitializerService {
  private authService = inject(AuthService);
  private initPromise: Promise<boolean> | null = null;

  init(): Promise<boolean> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = firstValueFrom(
      this.authService.detectCookies().pipe(
        map((res) => res),
        catchError(() => of(false))
      )
    );
    return this.initPromise;
  }
}
