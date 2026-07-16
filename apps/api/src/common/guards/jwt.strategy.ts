import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { UserStatus } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'src/config/env.config';
import { PrismaService } from 'src/database/prisma.service';
import {
  ACCESS_TOKEN_COOKIE,
  type AuthTokenPayload,
} from 'src/modules/auth/strategies/jwt/jwt.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.[ACCESS_TOKEN_COOKIE],
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_ACCESS_SECRET ?? env.JWT_SECRET,
    });
  }

  async validate(payload: AuthTokenPayload) {
    if (payload.tokenKind !== 'access') {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        googleId: true,
        phone_number: true,
        name: true,
        avatar: true,
        emailVerified: true,
        twoFactorEnabled: true,
        status: true,
        userRole: true,
        createdAt: true,
        updatedAt: true,
        ownedOrganizations: true,
        memberships: true,
        teamMemberships: true,
        links: true,
        notifications: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User session no longer exists');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    if (user.status !== ('ACTIVE' as UserStatus)) {
      throw new UnauthorizedException('Account is not active');
    }

    return payload;
  }
}
