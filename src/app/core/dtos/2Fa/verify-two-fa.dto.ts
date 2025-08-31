import { AuthenticationProviderType } from '../../enums/authentication-provider-type.enum';

export interface VerifyTwoFaDto {
  provider: AuthenticationProviderType;
  key: string;
}
