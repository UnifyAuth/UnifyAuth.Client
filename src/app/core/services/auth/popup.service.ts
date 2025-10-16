import { Injectable } from '@angular/core';
import { GooglePopupResult } from '../../dtos/auth/googlePopupResult';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private popup: Window | null = null;
  private readonly apiUrl = 'https://localhost:7036/api/Auth';

  constructor() {}
  //prettier-ignore
  loginWithGooglePopup(allowedOrigin: string): Promise<GooglePopupResult> {
    return new Promise((resolve, reject) => {
      const w = 480,
        h = 640;
      const dualScreenLeft = (window as any).screenLeft ?? window.screenX ?? 0;
      const dualScreenTop = (window as any).screenTop ?? window.screenY ?? 0;
      const width =
        window.innerWidth ??
        document.documentElement.clientWidth ??
        screen.width;
      const height =
        window.innerHeight ??
        document.documentElement.clientHeight ??
        screen.height;
      const left = width / 2 - w / 2 + dualScreenLeft;
      const top = height / 2 - h / 2 + dualScreenTop;

      const url = `${this.apiUrl}/login/google?origin=${allowedOrigin}`;
      this.popup = window.open(
        url,
        'google_login_popup',
        `width=${w},height=${h},top=${top},left=${left}, resizeable=yes,scrollbars=yes,status=no`
      );
      if (!this.popup) {
        return reject({ success: false, error: 'popup_blocked' });
      }

       const TIMEOUT = 60_000; // 1 dk
       const timeoutId = setTimeout(() => {
         cleanup();
         reject({ success: false, error: 'popup_timeout' });
       }, TIMEOUT);

      const tick = setInterval(() => {
        if (!this.popup || this.popup.closed) {
          cleanup();
          reject({ success: false, error: 'popup_closed' });
        }
      }, 500);

      const onMessage = (event: MessageEvent) => {
        const apiOrigin = new URL(this.apiUrl).origin;
        if (event.origin !== apiOrigin) return;

        const data = event.data || {};
        if (data.type !== 'google-login-result') return;
        
        cleanup();
        resolve({
          success: !!data.success,
          jwt: data.jwt,
          error: data.error,
        });
      };

      const cleanup = () => {
        window.removeEventListener('message', onMessage);
        window.clearTimeout(timeoutId);
        window.clearInterval(tick);
        try {
          if (this.popup && !this.popup.closed) this.popup.close();
        } catch {
          // swallow some browsers may throw
        }
        this.popup = null;
      };

      window.addEventListener('message', onMessage);
    })
  }
}
