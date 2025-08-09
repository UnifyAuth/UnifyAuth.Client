import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private http = inject(HttpClient);
  private accessToken: string | null = null;
  private apiUrl = 'https://localhost:7036/api/Auth';

  setAccessToken(token: string): void {
    this.accessToken = token;
  }
  getAccessToken(): string | null {
    return this.accessToken;
  }
  clearAccessToken(): void {
    this.accessToken = null;
  }

  refreshAccessToken(): Observable<string> {
    return this.http
      .post<{ token: string }>(
        `${this.apiUrl}/refresh-token`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((res) => this.setAccessToken(res.token)),
        map((res) => res.token)
      );
  }

  hasRefreshCookie(): Observable<boolean> {
    return this.http
      .get<{ hasRefreshCookie: boolean }>(`${this.apiUrl}/has-refresh-cookie`, {
        withCredentials: true,
      })
      .pipe(map((res) => res.hasRefreshCookie));
  }
}
