import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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
  private authService = inject(AuthService);

  readonly message = signal<MessageState | null>(null);

  constructor() {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');
    const encodedToken = encodeURIComponent(token!);

    if (userId && token) {
      this.authService.confirmEmail(userId, encodedToken).subscribe({
        next: (response) =>
          this.message.set({
            text: 'Email confirmed successfully!',
            type: 'success',
          }),
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
          } else {
            this.message.set({ text: 'Something went wrong.', type: 'error' });
          }
        },
      });
    } else {
      this.message.set({
        text: 'Invalid email confirmation link.',
        type: 'error',
      });
    }
  }
}
