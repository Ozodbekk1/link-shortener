// src/links/links.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { QueryLinkDto } from './dto/query-link.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

// ---- Workspace-scoped links CRUD (authenticated) ----
@Controller(':workspaceId/links')
export class WorkspaceLinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
    @Body() createLinkDto: CreateLinkDto,
  ) {
    const userId = req.user.sub as string;
    return this.linksService.create(userId, workspaceId, createLinkDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
    @Query() query: QueryLinkDto,
  ) {
    return this.linksService.findAll(workspaceId, query);
  }

  // ─── Analytics Routes (must precede :id to avoid conflicts) ──

  @Get('analytics/overview')
  @UseGuards(JwtAuthGuard)
  getAnalyticsOverview(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.linksService.getAnalyticsOverview(workspaceId);
  }

  @Get('analytics/realtime')
  @UseGuards(JwtAuthGuard)
  getRealtimeAnalytics(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.linksService.getRealtimeAnalytics(workspaceId);
  }

  @Get('analytics/countries')
  @UseGuards(JwtAuthGuard)
  getCountriesAnalytics(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.linksService.getCountriesAnalytics(workspaceId);
  }

  @Get('analytics/devices')
  @UseGuards(JwtAuthGuard)
  getDevicesAnalytics(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.linksService.getDevicesAnalytics(workspaceId);
  }

  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard)
  getLinkAnalytics(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
  ) {
    return this.linksService.getLinkAnalytics(id, workspaceId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
  ) {
    return this.linksService.findOne(id, workspaceId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    return this.linksService.update(id, workspaceId, updateLinkDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  remove(
    @Req() req: any,
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
  ) {
    return this.linksService.remove(id, workspaceId);
  }
}

// ---- Public slug resolution (no auth) ----
@Controller('links')
export class PublicLinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.linksService.findBySlug(slug);
  }
}
