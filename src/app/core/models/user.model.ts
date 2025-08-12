import { AuthenticationProviderType } from '../enums/authentication-provider-type.enum';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  preferred2FAProvider: AuthenticationProviderType;
  emailConfirmed: boolean;
  externalProvider?: string | null;
}
