import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { selectUser } from '../../../core/store/auth/auth.selector';
import { AuthenticationProviderType } from '../../../core/enums/authentication-provider-type.enum';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private store = inject(Store);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);

  user$!: Observable<User | null>;

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
