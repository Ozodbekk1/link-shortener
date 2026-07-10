import type { UserStatus } from '@prisma/client';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export type TokenKind = 'access' | 'refresh';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  tokenKind: TokenKind;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
