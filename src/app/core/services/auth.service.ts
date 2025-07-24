import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterDto } from '../dtos/auth/register.dto';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7036/api/Auth';

  register(registerDto: RegisterDto) {
    return this.http.post(`${this.apiUrl}/register`, registerDto);
  }

  confirmEmail(userId: string, token: string) {
    return this.http.post(`${this.apiUrl}/confirm-email`, { userId, token });
  }
}
