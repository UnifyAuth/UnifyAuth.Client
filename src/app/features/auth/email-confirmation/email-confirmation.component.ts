import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/account/account.service';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import { updateProfileSuccess } from '../../../core/store/auth/auth.actions';
import { isLoading } from '../../../core/state/loading-state';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
type MessageType = 'success' | 'error' | 'info';
type MessageState = {
  text: string;
  type: MessageType;
};

@Component({
  selector: 'app-email-confirmation',
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './email-confirmation.component.html',
})
export class EmailConfirmationComponent {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);

  readonly message = signal<MessageState | null>(null);
  loading = isLoading;

  constructor() {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');
    const encodedToken = encodeURIComponent(token!);

    if (userId && token) {
      this.accountService.confirmEmail(userId, encodedToken).subscribe({
        next: () => {
          localStorage.setItem('emailConfirmed', 'true');
          this.message.set({
            text: 'Email confirmed successfully!',
            type: 'success',
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Email confirmation error:', err);
          if (err.status === 400) {
            this.message.set({
              text:
                err.error.message ||
                'The confirmation link is invalid or has expired.',
              type: 'error',
            });
          } else if (err.status === 500) {
            this.message.set({
              text: 'Internal Server error. Please try again later.',
              type: 'error',
            });
          } else if (err.status === 404) {
            this.message.set({
              text:
                err.error.message ||
                'User not found. Please check the confirmation link.',
              type: 'error',
            });
          } else if (err.status === 409) {
            this.message.set({
              text:
                err.error.message ||
                'Concurrency failure. Please try again later.',
              type: 'error',
            });
          }
        },
      });
    } else {
      this.message.set({
        text: 'Invalid email confirmation link. Please get a new link.',
        type: 'error',
      });
    }
  }
}
