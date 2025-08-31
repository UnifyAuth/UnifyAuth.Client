import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { provideStore } from '@ngrx/store';
import { authReducer } from './core/store/auth/auth.reducer';
import { combineInitializer } from './app.initializer';
import { twoFaReducer } from './core/store/TwoFA/two-fa.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './core/store/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loadingInterceptor, errorInterceptor, tokenInterceptor])
    ),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      closeButton: true,
    }),
    provideAnimations(),
    provideStore({ auth: authReducer, twoFa: twoFaReducer }),
    provideEffects([AuthEffects]),
    // App initialization (Angular 19+ replacement for deprecated APP_INITIALIZER)
    provideAppInitializer(combineInitializer()),
    provideEffects(),
  ],
};
