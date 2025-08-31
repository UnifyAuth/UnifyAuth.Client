import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { selectUser } from '../../../core/store/auth/auth.selector';
import { CommonModule } from '@angular/common';
import { AuthenticationProviderType } from '../../../core/enums/authentication-provider-type.enum';
import { isLoading } from '../../../core/state/loading-state';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private store = inject(Store);
  private router = inject(Router);

  user$!: Observable<User | null>;
  Loading = isLoading;

  constructor() {
    this.user$ = this.store.select(selectUser);
  }

  getProviderLabel(
    provider: AuthenticationProviderType | undefined | null
  ): string {
    switch (provider) {
      case AuthenticationProviderType.None:
        return 'None';
      case AuthenticationProviderType.Email:
        return 'Email';
      case AuthenticationProviderType.Sms:
        return 'SMS';
      case AuthenticationProviderType.Authenticator:
        return 'Authenticator App';
      default:
        return '—';
    }
  }

  onChange2FA(): void {
    this.router.navigate(['/settings/2fa']);
  }

  onChangeEmail(): void {
    console.log('Change Email clicked');
    // Implement your logic here
  }

  onChangePhoneNumber(): void {
    console.log('Change Phone Number clicked');
    // Implement your logic here
  }
}
