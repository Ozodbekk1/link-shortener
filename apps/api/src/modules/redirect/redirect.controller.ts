import {
  Controller,
  Get,
  Param,
  Req,
  Query,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { RedirectService } from './redirect.service';

@Controller()
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get('r/:slug')
  @HttpCode(HttpStatus.FOUND) // 302
  async redirect(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Res() res: Response,
    @Query('password') password?: string,
  ) {
    const destinationUrl = await this.redirectService.resolveAndRedirect(
      slug,
      req,
      password,
    );

    return res.redirect(HttpStatus.FOUND, destinationUrl);
  }

  @Get('redirect/:slug')
  async validateRedirect(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Query('password') password?: string,
  ) {
    return this.redirectService.validateSlug(slug, req, password);
  }

  @Get('redirect/rules/:slug')
  async previewRules(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Query('password') password?: string,
  ) {
    return this.redirectService.previewRules(slug, req, password);
  }
}
