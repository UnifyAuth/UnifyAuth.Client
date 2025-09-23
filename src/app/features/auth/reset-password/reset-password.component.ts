import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordValidator } from '../validators/password.validator';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { isLoading } from '../../../core/state/loading-state';
import { ResetPasswordDto } from '../../../core/dtos/auth/resetPassword.dto';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent, RouterModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private resetPasswordDto: ResetPasswordDto | null = null;

  loading = isLoading;
  resetPasswordForm: FormGroup = this.createResetPasswordForm();
  showPasswords = false;
  passwordResetSuccess = false; // Flag to track password reset success

  constructor() {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');
    this.resetPasswordDto = {
      userId: userId!,
      token: token!,
      newPassword: '',
      confirmedPassword: '',
    };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    this.resetPasswordDto = {
      ...this.resetPasswordDto!,
      ...this.resetPasswordForm.getRawValue(),
    };
    this.authService.resetPassword(this.resetPasswordDto!).subscribe({
      next: () => {
        this.passwordResetSuccess = true;
      },
    });
  }

  createResetPasswordForm(): FormGroup {
    return this.fb.group(
      {
        newPassword: [
          '',
          [Validators.required, PasswordValidator.strongPassword()],
        ],
        confirmedPassword: ['', Validators.required],
      },
      {
        validators: PasswordValidator.matchPasswords(
          'newPassword',
          'confirmedPassword'
        ),
      }
    );
  }

  getPasswordErrors(): string[] {
    const control = this.resetPasswordForm.get('newPassword');
    if (!control || !control.errors || !control.touched) return [];

    const errors = control.errors;
    const messages: string[] = [];

    if (errors['required']) {
      messages.push('Password is required.');
    }
    if (errors['minLength']) {
      messages.push('Minimum 8 characters.');
    }
    if (errors['upperLower']) {
      messages.push('Must include uppercase & lowercase.');
    }
    if (errors['number']) {
      messages.push('Must include at least one number.');
    }
    if (errors['specialChar']) {
      messages.push('Must include a special character.');
    }

    return messages;
  }

  togglePasswordsVisibility() {
    this.showPasswords = !this.showPasswords;
  }
}
