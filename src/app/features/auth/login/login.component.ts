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
import { EMPTY, switchMap, tap } from 'rxjs';
import { AccountService } from '../../../core/services/account/account.service';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../../core/store/auth/auth.actions';
import { selectIsVerifying } from '../../../core/store/TwoFA/two-fa.selector';
import {
  startVerify,
  stopVerify,
} from '../../../core/store/TwoFA/two-fa.actions';
import { VerifyTwoFactorLoginDto } from '../../../core/dtos/auth/verifyTwoFactorLogin.dto';
import { TwoFaVerifyComponent } from '../../../shared/components/TwoFaVerify/two-fa-verify/two-fa-verify.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    SpinnerComponent,
    ReactiveFormsModule,
    TwoFaVerifyComponent,
  ],
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
  isVerifying$ = this.store.select(selectIsVerifying);
  verifyTwoFactorLoginDto: VerifyTwoFactorLoginDto | null = null;
  verificationMessage = '';

  onSubmit() {
    if (this.LoginForm.invalid) {
      this.LoginForm.markAllAsTouched();
      return;
    }
    const loginDto: LoginDto = this.LoginForm.getRawValue();
    this.authService
      .login(loginDto)
      .pipe(
        switchMap((result) => {
          if (!result.isTwoFactorRequired) {
            return this.accountService.getUserProfile();
          }
          switch (result.provider) {
            case 'Email':
              this.verificationMessage =
                'A verification code has been sent to your email.';
              break;
            case 'Phone':
              this.verificationMessage =
                'A verification code has been sent to your phone.';
              break;
            case 'Authenticator':
              this.verificationMessage =
                'Please enter the code from your authenticator app.';
              break;
          }
          this.verifyTwoFactorLoginDto = {
            userId: result.userId,
            provider: result.provider,
            key: '', // Key will be set when user inputs it in the TwoFaVerifyComponent
          };
          this.store.dispatch(startVerify());
          return EMPTY;
        }),
        tap((user) => {
          this.store.dispatch(loginSuccess({ user }));
          this.router.navigate(['/']);
        })
      )
      .subscribe();
  }
  onCodeVerified(key: string) {
    this.verifyTwoFactorLoginDto!.key = key;
    this.authService
      .verifyTwoFactorLogin(this.verifyTwoFactorLoginDto!)
      .pipe(
        switchMap(() => {
          this.store.dispatch(stopVerify());
          return this.accountService.getUserProfile();
        }),
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
