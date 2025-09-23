export interface LoginResponseDto {
  userId: string;
  isTwoFactorRequired: boolean;
  provider: string;
  accessToken: { token: string; expiresAt: string };
}
