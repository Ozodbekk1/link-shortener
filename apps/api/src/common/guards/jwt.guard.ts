import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'src/config/env.config';
import {
  ACCESS_TOKEN_COOKIE,
  type AuthTokenPayload,
} from 'src/modules/auth/strategies/jwt/jwt.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
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

    return payload;
  }
}
