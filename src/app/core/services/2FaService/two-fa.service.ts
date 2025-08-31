import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TwoFaConfigurationDto } from '../../dtos/2Fa/two-fa-configuration.dto';
import { Observable } from 'rxjs';
import { VerifyTwoFaDto } from '../../dtos/2Fa/verify-two-fa.dto';

@Injectable({
  providedIn: 'root',
})
export class TwoFaService {
  private readonly apiUrl = 'https://localhost:7036/api/Account';
  private http = inject(HttpClient);

  configure2Fa(provider: string): Observable<TwoFaConfigurationDto> {
    return this.http.post<TwoFaConfigurationDto>(
      `${this.apiUrl}/configure-2fa?provider=${provider}`,
      null
    );
  }

  verify2FaConfiguration(verifyTwoFaDto: VerifyTwoFaDto): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/verify-2fa-configuration`,
      verifyTwoFaDto
    );
  }
}
