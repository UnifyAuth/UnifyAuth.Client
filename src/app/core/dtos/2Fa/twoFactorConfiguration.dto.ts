import { AuthenticationProviderType } from '../../enums/authentication-provider-type.enum';

export interface TwoFactorConfigurationDto {
  provider: AuthenticationProviderType;
  sharedKey: string;
  qrCodeUri: string;
}
