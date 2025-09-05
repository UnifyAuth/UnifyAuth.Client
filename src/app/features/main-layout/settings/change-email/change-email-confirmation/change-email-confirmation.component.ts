import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../../../core/services/account/account.service';
import { isLoading } from '../../../../../core/state/loading-state';
import { ChangeEmailDto } from '../../../../../core/dtos/account/change-email.dto';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../../../../../core/store/auth/auth.actions';
import { emailChangeSuccess } from '../../../../../core/store/account/account.action';
type MessageType = 'success' | 'error' | 'info';
type MessageState = {
  text: string;
  type: MessageType;
};

@Component({
  selector: 'app-change-email-confirmation',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './change-email-confirmation.component.html',
})
export class ChangeEmailConfirmationComponent {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private store = inject(Store);

  readonly message = signal<MessageState | null>(null);
  loading = isLoading;

  constructor() {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = localStorage.getItem('newEmail'); // Read from localStorage

    if (userId && token && email) {
      const encodedToken = encodeURIComponent(token);
      const changeEmailDto: ChangeEmailDto = {
        email: email,
        token: encodedToken,
        userId: userId,
      };
      this.accountService.verifyChangeEmail(changeEmailDto).subscribe({
        next: () => {
          this.message.set({
            text: 'E-mail address changed successfully.Redirecting to settings page... ',
            type: 'success',
          });
          this.store.dispatch(getCurrentUser()); // Refresh user data in the store
          this.store.dispatch(emailChangeSuccess()); // Update state to reflect email change success
          localStorage.removeItem('newEmail'); // Clean up
          setTimeout(() => this.router.navigate(['/settings']), 5000);
        },
        error: () => {
          this.message.set({
            text: 'An error occurred while changing the email address. Please try again later.',
            type: 'error',
          });
          localStorage.removeItem('newEmail'); // Clean up
        },
      });
    } else if (!email) {
      // Handle missing email case.
      this.message.set({
        text: 'New email address not found. The confirmation link may have expired or is invalid. Please initiate the email change process again.',
        type: 'info',
      });
    }
  }
}
