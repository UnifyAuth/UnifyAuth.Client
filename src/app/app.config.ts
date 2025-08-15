import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideAppInitializer,
  inject,
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
    provideStore({ auth: authReducer }),
    // App initialization (Angular 19+ replacement for deprecated APP_INITIALIZER)
    provideAppInitializer(combineInitializer()),
  ],
};
