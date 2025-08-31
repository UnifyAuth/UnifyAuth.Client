import { AuthenticationProviderType } from '../../enums/authentication-provider-type.enum';

export interface TwoFaConfigurationDto {
  provider: AuthenticationProviderType;
  sharedKey: string;
  qrCodeUri: string;
}
