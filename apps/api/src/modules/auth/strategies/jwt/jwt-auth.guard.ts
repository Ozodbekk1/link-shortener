import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { env } from 'src/config/env.config';
import { ACCESS_TOKEN_COOKIE, type AuthTokenPayload } from './jwt.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: NestJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthTokenPayload }>();
    const token = this.readCookie(request.headers.cookie, ACCESS_TOKEN_COOKIE);

    if (!token) {
      throw new UnauthorizedException('Missing access token cookie');
    }

    try {
      request.user = await this.jwtService.verifyAsync<AuthTokenPayload>(
        token,
        {
          secret: env.JWT_ACCESS_SECRET ?? env.JWT_SECRET,
        },
      );

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private readCookie(cookieHeader: string | undefined, cookieName: string) {
    if (!cookieHeader) {
      return undefined;
    }

    const cookieValue = cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${cookieName}=`));

    if (!cookieValue) {
      return undefined;
    }

    return decodeURIComponent(cookieValue.slice(cookieName.length + 1));
  }
}
