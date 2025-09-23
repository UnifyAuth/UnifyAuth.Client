export interface VerifyTwoFactorLoginDto {
  userId: string;
  provider: string;
  key: string;
}
