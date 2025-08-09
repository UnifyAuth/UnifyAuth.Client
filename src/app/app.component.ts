import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenService } from './core/services/auth/token.service';
import { isLoading } from './core/state/loading-state';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent, CommonModule],
  template: '<app-spinner *ngIf="loading()"></app-spinner> <router-outlet />',
})
export class AppComponent {
  title = 'UnifyAuth.Client';

  // Use the readonly signal directly; call loading() in the template
  loading = isLoading;
}
