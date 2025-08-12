import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/account/account.service';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import { updateProfileSuccess } from '../../../core/store/auth/auth.actions';
type MessageType = 'success' | 'error' | 'info';
type MessageState = {
  text: string;
  type: MessageType;
};

@Component({
  selector: 'app-email-confirmation',
  imports: [CommonModule, RouterModule],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css',
})
export class EmailConfirmationComponent {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private store = inject(Store);

  readonly message = signal<MessageState | null>(null);

  constructor() {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');
    const encodedToken = encodeURIComponent(token!);

    if (userId && token) {
      this.accountService.confirmEmail(userId, encodedToken).subscribe({
        next: () => {
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
