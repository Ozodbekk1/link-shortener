import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CookieService } from 'src/common/utils/cookie.util';
import type { TelegramAuthPayload } from './telegram.service';
import { TelegramService } from './telegram.service';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 3, ttl: 60000 } })
@Controller('telegram/auth')
export class TelegramController {
  constructor(
    private readonly authService: TelegramService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async handleTelegramLogin(
    @Body() telegramPayload: TelegramAuthPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Receives raw web widget or Mini App payload containing data fields + hash parameter
    const { user, accessToken, refreshToken } =
      await this.authService.loginWithTelegram(telegramPayload);

    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }
}
