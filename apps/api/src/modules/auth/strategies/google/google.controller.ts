import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';

import { GoogleAuthService } from './google.service';
import { GoogleAuthGuard } from 'src/common/guards/google.guard';
import { CookieService } from 'src/common/utils/cookie.util';
import { type GoogleOAuthUserData } from './google.service';
import { env } from 'src/config/env.config';
import { Throttle } from '@nestjs/throttler';

interface GoogleAuthRequest extends Request {
  user: GoogleOAuthUserData;
}

@Throttle({ default: { limit: 3, ttl: 60000 } })
@Controller('google/auth')
export class GoogleAuthController {
  constructor(
    private readonly authService: GoogleAuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {}

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: GoogleAuthRequest,
    @Res() res: Response,
  ) {
    const user = req.user;

    const { accessToken, refreshToken } =
      await this.authService.generateJwtTokens(user);

    this.cookieService.setAuthCookies(res, accessToken, refreshToken);

    // Browser redirect to the web app's Google callback page, which runs
    // usePostAuthRedirect(): fetches GET /users/me and routes to
    // onboarding (no org) or {slug}.uurl.uz/dashboard (has org).
    //
    // Production safety: if WEB_ORIGIN is missing, NEVER fall back to localhost.
    const webOrigin = env.WEB_ORIGIN
      ? env.WEB_ORIGIN.split(',')[0].trim()
      : process.env.NODE_ENV === 'production'
        ? `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'uurl.uz'}`
        : 'http://localhost:3000';

    const locale = (req.query?.state as string) || 'en';

    const redirectUrl = `${webOrigin}/${locale}/auth/google/callback`;

    res.redirect(redirectUrl);
  }
}
