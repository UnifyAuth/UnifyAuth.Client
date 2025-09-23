import { AuthenticationProviderType } from '../../enums/authentication-provider-type.enum';

export interface VerifyTwoFactorConfigurationDto {
  provider: AuthenticationProviderType;
  key: string;
}
