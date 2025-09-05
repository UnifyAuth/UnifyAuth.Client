import { Component, inject } from '@angular/core';
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
import { LoginDto } from '../../../core/dtos/auth/login.dto';
import { AuthService } from '../../../core/services/auth/auth.service';
import { switchMap, tap } from 'rxjs';
import { AccountService } from '../../../core/services/account/account.service';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, SpinnerComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private store = inject(Store);
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
    this.authService
      .login(loginDto)
      .pipe(
        switchMap(() => this.accountService.getUserProfile()),
        tap((user) => {
          this.store.dispatch(loginSuccess({ user }));
          this.router.navigate(['/']);
        })
      )
      .subscribe();
  }
  createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordsVisibility() {
    this.showPassword = !this.showPassword;
  }
}
