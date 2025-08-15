import { inject } from '@angular/core';
import { AuthInitializerService } from './core/services/initializerServices/auth-initializer.service';
import { UserInitializerService } from './core/services/initializerServices/user-initializer.service';

export function combineInitializer(): () => Promise<void> {
  return async () => {
    const authInit = inject(AuthInitializerService);
    const userInit = inject(UserInitializerService);

    const refreshed = await authInit.init();

    if (refreshed) {
      await userInit.init();
    }
  };
}
