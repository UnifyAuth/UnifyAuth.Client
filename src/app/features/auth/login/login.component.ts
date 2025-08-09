import { Component, computed, inject } from '@angular/core';
import { isLoading } from '../../../core/state/loading-state';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { EmailFormatValidator } from '../../../shared/validators/email-format.validator';
import { LoginDto } from '../../../core/dtos/auth/login.dto';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, SpinnerComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = isLoading; // Computed property to track loading state for UI spinner
  LoginForm: FormGroup = this.createLoginForm();
  showPassword = false; // Flag to toggle password visibility

  onSubmit() {
    if (this.LoginForm.invalid) {
      this.LoginForm.markAllAsTouched();
      return;
    }
    const loginDto: LoginDto = this.LoginForm.getRawValue();
    this.authService.login(loginDto).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
    });
  }
  createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, EmailFormatValidator.emailFormat()]],
      password: ['', Validators.required],
    });
  }

  togglePasswordsVisibility() {
    this.showPassword = !this.showPassword;
  }
}
