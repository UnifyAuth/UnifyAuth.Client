import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { selectUser } from '../../../core/store/auth/auth.selector';
import { AuthenticationProviderType } from '../../../core/enums/authentication-provider-type.enum';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';
import { ToastrService } from 'ngx-toastr';
import { isLoading } from '../../../core/state/loading-state';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { updateProfileSuccess } from '../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private store = inject(Store);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);

  user$!: Observable<User | null>;
  Loading = isLoading;

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'emailConfirmed' && event.newValue === 'true') {
      localStorage.removeItem('emailConfirmed');
      this.store
        .select(selectUser)
        .pipe(take(1))
        .subscribe((user) => {
          if (user) {
            const updatedUser = { ...user, emailConfirmed: true };
            this.store.dispatch(updateProfileSuccess({ user: updatedUser }));
          }
        });
    }
  }
  constructor() {
    this.user$ = this.store.select(selectUser);
  }

  getProviderLabel(
    provider: AuthenticationProviderType | undefined | null
  ): string {
    switch (provider) {
      case AuthenticationProviderType.Email:
        return 'Email';
      case AuthenticationProviderType.Sms:
        return 'SMS';
      case AuthenticationProviderType.AuthenticatorApp:
        return 'Authenticator App';
      default:
        return '—';
    }
  }

  onEditClick() {
    this.router.navigate(['/profile/edit']);
  }

  onConfirmEmail(email: string) {
    this.accountService.sendEmailConfirmationLink(email).subscribe({
      next: () => {
        this.toastr.success(
          'Email confirmation link sent successfully. Please check your inbox.'
        );
      },
    });
  }
}
