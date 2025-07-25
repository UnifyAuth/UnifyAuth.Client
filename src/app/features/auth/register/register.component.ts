import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterValidator } from '../validators/register.validator';
import { AuthService } from '../../../core/services/auth.service';
import { EmailFormatValidator } from '../../../shared/validators/email-format.validator';
import { isLoading } from '../../../core/state/loading-state';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { RegisterDto } from '../../../core/dtos/auth/register.dto';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loading = computed(() => isLoading());
  registrationSuccess = false;
  registerForm: FormGroup = this.createRegisterForm();

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
        email: ['', [Validators.required, EmailFormatValidator.emailFormat()]],
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
}
