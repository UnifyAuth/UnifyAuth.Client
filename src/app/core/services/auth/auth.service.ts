import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { LoginDto } from '../../dtos/auth/login.dto';
import { TokenService } from './token.service';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { ResetPasswordDto } from '../../dtos/auth/resetPassword.dto';
import { LoginResponseDto } from '../../dtos/auth/loginResponse.dto';
import { VerifyTwoFactorLoginDto } from '../../dtos/auth/verifyTwoFactorLogin.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private readonly apiUrl = 'https://localhost:7036/api/Auth';

  register(registerDto: RegisterDto): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/register`, registerDto)
      .pipe(map(() => void 0));
  }

  confirmEmail(userId: string, token: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/confirm-email`, {
        userId,
        token,
      })
      .pipe(map(() => void 0));
  }

  login(loginDto: LoginDto): Observable<LoginResponseDto> {
    return this.http
      .post<LoginResponseDto>(`${this.apiUrl}/login`, loginDto, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (!response.isTwoFactorRequired) {
            this.tokenService.setAccessToken(response.accessToken.token);
          }
        })
      );
  }

  // prettier-ignore
  verifyTwoFactorLogin(verifyTwoFactorLoginDto: VerifyTwoFactorLoginDto): Observable<void> {
    return this.http
      .post<{token: string}>(`${this.apiUrl}/login-2fa`, verifyTwoFactorLoginDto, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.tokenService.setAccessToken(response.token);
        }),
        map(() => void 0)
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.tokenService.clearAccessToken()),
        map(() => void 0)
      );
  }

  sendResetPasswordLink(email: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/send-reset-password-link`, { email })
      .pipe(map(() => void 0));
  }

  resetPassword(resetPasswordDto: ResetPasswordDto): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/reset-password`, resetPasswordDto)
      .pipe(map(() => void 0));
  }

  detectCookies(): Observable<boolean> {
    return this.http
      .post(`${this.apiUrl}/cookie-test/set`, {}, { withCredentials: true })
      .pipe(
        switchMap(() =>
          this.http.get<{ hasTestCookie: boolean }>(
            `${this.apiUrl}/cookie-test/get`,
            { withCredentials: true }
          )
        ),
        map((res) => {
          console.log('Cookie detection result:', res.hasTestCookie);
          return !!res?.hasTestCookie;
        }),
        catchError(() => of(false))
      );
  }
}
