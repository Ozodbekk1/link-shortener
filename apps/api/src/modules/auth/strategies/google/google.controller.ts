import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';

import { GoogleAuthService } from './google.service';
import { GoogleAuthGuard } from 'src/common/guards/google.guard';
import { CookieService } from 'src/common/utils/cookie.util';
import { type GoogleOAuthUserData } from './google.service';
import { Throttle } from '@nestjs/throttler';

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
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = (req as { user: GoogleOAuthUserData }).user;

    const { accessToken, refreshToken } =
      await this.authService.generateJwtTokens(user);

    this.cookieService.setAuthCookies(res, accessToken, refreshToken);

    return {
      url: 'http://localhost:3000/dashboard',
      statusCode: 302,
    };
  }
}
