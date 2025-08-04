import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = 'https://localhost:7036/api/Account';
  private http = inject(HttpClient);

  getUserProfile() {
    return this.http.get(`${this.apiUrl}/profile`, { withCredentials: true });
  }
}
