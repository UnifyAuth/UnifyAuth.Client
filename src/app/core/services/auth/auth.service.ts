import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { LoginDto } from '../../dtos/auth/login.dto';
import { TokenService } from './token.service';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private readonly apiUrl = 'https://localhost:7036/api/Auth';

  register(registerDto: RegisterDto) {
    return this.http.post(`${this.apiUrl}/register`, registerDto);
  }

  confirmEmail(userId: string, token: string) {
    return this.http.post(`${this.apiUrl}/confirm-email`, { userId, token });
  }

  login(loginDto: LoginDto): Observable<void> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, loginDto, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          console.log('Login successful, setting access token:', response);
          this.tokenService.setAccessToken(response.token);
        }),
        map(() => void 0)
      );
  }
}
