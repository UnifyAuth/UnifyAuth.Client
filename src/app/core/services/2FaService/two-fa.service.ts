import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TwoFactorConfigurationDto } from '../../dtos/2Fa/twoFactorConfiguration.dto';
import { Observable } from 'rxjs';
import { VerifyTwoFactorConfigurationDto } from '../../dtos/2Fa/verifyTwoFactorConfiguration.dto';

@Injectable({
  providedIn: 'root',
})
export class TwoFaService {
  private readonly apiUrl = 'https://localhost:7036/api/Account';
  private http = inject(HttpClient);

  configure2Fa(provider: string): Observable<TwoFactorConfigurationDto> {
    return this.http.post<TwoFactorConfigurationDto>(
      `${this.apiUrl}/configure-2fa?provider=${provider}`,
      null
    );
  }

  verify2FaConfiguration(
    verifyTwoFaDto: VerifyTwoFactorConfigurationDto
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/verify-2fa-configuration`,
      verifyTwoFaDto
    );
  }
}
