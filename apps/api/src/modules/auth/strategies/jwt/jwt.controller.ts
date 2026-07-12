import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginDto, RegisterDto, verifyEmailDto } from '../../dto/auth.dto';
import { REFRESH_TOKEN_COOKIE, type AuthTokenPayload } from './jwt.types';
import { CookieService } from 'src/common/utils/cookie.util';
import { JwtService } from './jwt.service';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';

@Controller('jwt/auth')
export class JwtController {
  constructor(
    private readonly authService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(dto);
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() dto: verifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.verifyEmail(dto);
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(dto);
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const currentRefreshToken = (
      req.cookies as Record<string, string | undefined>
    )?.[REFRESH_TOKEN_COOKIE];

    if (!currentRefreshToken)
      throw new UnauthorizedException('Missing refresh token cookie');

    const { user, accessToken, refreshToken } =
      await this.authService.refresh(currentRefreshToken);
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const currentRefreshToken = (
      req.cookies as Record<string, string | undefined>
    )?.[REFRESH_TOKEN_COOKIE];
    if (currentRefreshToken) {
      await this.authService.revokeSession(currentRefreshToken);
    }
    this.cookieService.clearAuthCookies(res);
    return { status: 'logout' };
  }

  // Assuming an AuthGuard assigns the payload to req.user beforehand
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request & { user?: AuthTokenPayload }) {
    if (!req.user)
      throw new UnauthorizedException('Missing authenticated user');
    const user = await this.authService.getProfile(req.user.sub);
    return { user };
  }
}
