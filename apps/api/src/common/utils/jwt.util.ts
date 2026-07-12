import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { env } from 'src/config/env.config';
import type { User } from '@prisma/client';
import {
  AuthTokenPayload,
  TokenKind,
} from 'src/modules/auth/strategies/jwt/jwt.types';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: NestJwtService) {}

  async signToken(user: User, tokenKind: TokenKind): Promise<string> {
    const expiresIn = this.parseDurationToSeconds(
      tokenKind === 'access'
        ? env.ACCESS_TOKEN_EXPIRY
        : env.REFRESH_TOKEN_EXPIRY,
    );

    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        tokenKind,
      } satisfies AuthTokenPayload,
      {
        secret:
          tokenKind === 'access'
            ? (env.JWT_ACCESS_SECRET ?? env.JWT_SECRET)
            : (env.JWT_REFRESH_SECRET ?? env.JWT_SECRET),
        expiresIn,
      },
    );
  }

  async verifyToken(
    token: string,
    tokenKind: TokenKind,
  ): Promise<AuthTokenPayload> {
    return this.jwtService.verifyAsync<AuthTokenPayload>(token, {
      secret:
        tokenKind === 'access'
          ? (env.JWT_ACCESS_SECRET ?? env.JWT_SECRET)
          : (env.JWT_REFRESH_SECRET ?? env.JWT_SECRET),
    });
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async compareData(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  private parseDurationToSeconds(expiry: string): number {
    const match = /^(\d+)(ms|s|m|h|d)$/.exec(expiry);
    if (!match) return 15 * 60;

    const amount = Number(match[1]);
    const unit = match[2] as 'ms' | 's' | 'm' | 'h' | 'd';
    const multipliers = {
      ms: 1 / 1000,
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60,
    } as const;

    return Math.floor(amount * multipliers[unit]);
  }
}
