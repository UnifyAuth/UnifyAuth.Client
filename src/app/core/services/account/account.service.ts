import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../models/user.model';

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
}
