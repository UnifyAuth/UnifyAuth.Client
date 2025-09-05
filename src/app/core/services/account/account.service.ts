import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ChangeEmailDto } from '../../dtos/account/change-email.dto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = 'https://localhost:7036/api/Account';
  private http = inject(HttpClient);

  getUserProfile() {
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      withCredentials: true,
    });
  }

  updateUserProfile(user: User) {
    return this.http.put(`${this.apiUrl}/edit-profile`, user, {
      withCredentials: true,
    });
  }

  sendEmailConfirmationLink(email: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/send-email-confirmation-link`,
      { email },
      {
        withCredentials: true,
      }
    );
  }

  confirmEmail(userId: string, token: string) {
    return this.http.post(`${this.apiUrl}/confirm-email`, { userId, token });
  }

  changeEmailConfirmationLink(email: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/send-change-email-link`,
      { email },
      { withCredentials: true }
    );
  }

  verifyChangeEmail(changeEmailDto: ChangeEmailDto): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/verify-change-email`,
      changeEmailDto,
      { withCredentials: true }
    );
  }
}
