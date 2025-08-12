import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterValidator } from '../validators/register.validator';
import { AuthService } from '../../../core/services/auth/auth.service';
import { isLoading } from '../../../core/state/loading-state';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { RegisterDto } from '../../../core/dtos/auth/register.dto';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loading = isLoading; // Computed property to track loading state for UI spinner
  registrationSuccess = false; // Flag to indicate successful registration for UI feedback
  registerForm: FormGroup = this.createRegisterForm();
  showPasswords = false; // Flag to toggle password visibility

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const registerDto: RegisterDto = this.registerForm.getRawValue();
    this.authService.register(registerDto).subscribe({
      next: () => {
        this.registrationSuccess = true;
      },
    });
  }

  createRegisterForm(): FormGroup {
    return this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        password: [
          '',
          [Validators.required, RegisterValidator.strongPassword()],
        ],
        confirmedPassword: ['', Validators.required],
      },
      {
        validators: RegisterValidator.matchPasswords(
          'password',
          'confirmedPassword'
        ),
      }
    );
  }

  getPasswordErrors(): string[] {
    const control = this.registerForm.get('password');
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
