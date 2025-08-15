import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { isLoading } from '../../../core/state/loading-state';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loading = isLoading;
  form: FormGroup = this.createForm();
  showEmailSentMessage = false; // Flag to show email sent message

  onSubmit() {
    if (this.form.invalid) {
      console.log('Form is invalid');
      this.form.markAllAsTouched();
      return;
    }
    console.log('Form submitted:', this.form.value);
    this.authService.sendResetPasswordLink(this.form.value.email).subscribe({
      next: () => {
        this.showEmailSentMessage = true; // Show email sent message
      },
    });
  }
  createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
