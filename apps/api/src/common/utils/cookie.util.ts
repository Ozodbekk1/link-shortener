import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { env } from 'src/config/env.config';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from 'src/modules/auth/strategies/jwt/jwt.types';

@Injectable()
export class CookieService {
  setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    response.cookie(
      ACCESS_TOKEN_COOKIE,
      accessToken,
      this.buildCookieOptions(env.ACCESS_TOKEN_EXPIRY),
    );
    response.cookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      this.buildCookieOptions(env.REFRESH_TOKEN_EXPIRY),
    );
  }

  clearAuthCookies(response: Response): void {
    response.clearCookie(
      ACCESS_TOKEN_COOKIE,
      this.buildCookieOptions(env.ACCESS_TOKEN_EXPIRY),
    );
    response.clearCookie(
      REFRESH_TOKEN_COOKIE,
      this.buildCookieOptions(env.REFRESH_TOKEN_EXPIRY),
    );
  }

  private buildCookieOptions(expiry: string) {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: this.parseDurationToMs(expiry),
    };
  }

  private parseDurationToMs(expiry: string): number {
    const match = /^(\d+)(ms|s|m|h|d)$/.exec(expiry);
    if (!match) return 15 * 60 * 1000;

    const amount = Number(match[1]);
    const unit = match[2] as 'ms' | 's' | 'm' | 'h' | 'd';
    const multipliers = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    } as const;

    return amount * multipliers[unit];
  }
}
