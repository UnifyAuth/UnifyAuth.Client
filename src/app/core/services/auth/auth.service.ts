import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { LoginDto } from '../../dtos/auth/login.dto';
import { TokenService } from './token.service';
import { map, Observable, tap } from 'rxjs';
import { ResetPasswordDto } from '../../dtos/auth/resetPassword.dto';

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

  login(loginDto: LoginDto): Observable<void> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, loginDto, {
        withCredentials: true,
      })
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
}
