import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookiesOffComponent } from './shared/components/cookiesOff/cookies-off.component';
import { isCookieOff } from './core/state/cookie-state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, CookiesOffComponent],
  // prettier-ignore
  template: '<app-cookies-off *ngIf="cookieOff()"> </app-cookies-off> <router-outlet />',
})
export class AppComponent {
  title = 'UnifyAuth.Client';

  cookieOff = isCookieOff;
}
