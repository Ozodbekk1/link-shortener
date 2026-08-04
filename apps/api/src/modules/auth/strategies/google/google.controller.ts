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
    // CRITICAL: the origin MUST be an absolute URL (include http/https).
    // res.redirect() treats scheme-less strings as *relative* URLs and
    // resolves them against the current request path — producing broken
    // URLs like /api/v1/google/auth/uurl.uz/en/auth/google/callback.
    const rawOrigin = env.WEB_ORIGIN
      ? env.WEB_ORIGIN.split(',')[0].trim()
      : process.env.NODE_ENV === 'production'
        ? 'uurl.uz'
        : 'localhost:3000';

    const webOrigin = /^https?:\/\//i.test(rawOrigin)
      ? rawOrigin
      : `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${rawOrigin}`;

    const locale = (req.query?.state as string) || 'en';

    const redirectUrl = `${webOrigin}/${locale}/auth/google/callback`;

    res.redirect(redirectUrl);
  }
}
