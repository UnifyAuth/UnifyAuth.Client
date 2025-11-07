import { inject } from '@angular/core';
import { AuthInitializerService } from './core/services/initializerServices/auth-initializer.service';
import { UserInitializerService } from './core/services/initializerServices/user-initializer.service';
import { CookieDetectInitializerService } from './core/services/initializerServices/cookie-detect-initializer.service';
import { setCookieOff } from './core/state/cookie-state';

export function combineInitializer(): () => Promise<void> {
  return async () => {
    const authInit = inject(AuthInitializerService);
    const userInit = inject(UserInitializerService);
    const cookieDetectInit = inject(CookieDetectInitializerService);

    const detected = await cookieDetectInit.init();
    if (!detected) {
      setCookieOff(true);
      return;
    }
    setCookieOff(false);
    const refreshed = await authInit.init();

    if (refreshed) {
      await userInit.init();
    }
  };
}
