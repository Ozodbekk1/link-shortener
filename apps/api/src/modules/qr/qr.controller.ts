import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { QrService } from './qr.service';
import { GenerateQrDto } from './dto/generate-qr.dto';
import { UpdateQrDto } from './dto/update-qr.dto';
import { QueryQrDto } from './dto/query-qr.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller(':workspaceId/qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: GenerateQrDto,
  ) {
    // Map DTO to QrStyle interface
    const style = {
      ...(dto.foregroundColor && { foregroundColor: dto.foregroundColor }),
      ...(dto.backgroundColor && { backgroundColor: dto.backgroundColor }),
      ...(dto.size && { size: dto.size }),
      ...(dto.margin !== undefined && { margin: dto.margin }),
      ...(dto.logoUrl && { logoUrl: dto.logoUrl }),
      ...(dto.logoSize !== undefined && { logoSize: dto.logoSize }),
      ...(dto.dotStyle && { dotStyle: dto.dotStyle }),
      ...(dto.cornerStyle && { cornerStyle: dto.cornerStyle }),
      ...(dto.gradientStart && { gradientStart: dto.gradientStart }),
      ...(dto.gradientEnd && { gradientEnd: dto.gradientEnd }),
      ...(dto.gradientDirection && {
        gradientDirection: dto.gradientDirection,
      }),
    };

    return this.qrService.create(workspaceId, dto.linkId, style);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('workspaceId') workspaceId: string,
    @Query() query: QueryQrDto,
  ) {
    return this.qrService.findAll(
      workspaceId,
      query.linkId,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.qrService.findOne(id);
  }

  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.qrService.getQrImageBuffer(id);

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=3600',
    });

    return res.send(buffer);
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    // Get QR code for filename
    const qrCode = await this.qrService.findOne(id);
    const buffer = await this.qrService.getQrImageBuffer(id);

    const filename = `qr-${qrCode.link.shortSlug || qrCode.id}.png`;

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });

    return res.send(buffer);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
    @Body() dto: UpdateQrDto,
  ) {
    const style = {
      ...(dto.foregroundColor && { foregroundColor: dto.foregroundColor }),
      ...(dto.backgroundColor && { backgroundColor: dto.backgroundColor }),
      ...(dto.size && { size: dto.size }),
      ...(dto.margin !== undefined && { margin: dto.margin }),
      ...(dto.logoUrl && { logoUrl: dto.logoUrl }),
      ...(dto.logoSize !== undefined && { logoSize: dto.logoSize }),
      ...(dto.dotStyle && { dotStyle: dto.dotStyle }),
      ...(dto.cornerStyle && { cornerStyle: dto.cornerStyle }),
      ...(dto.gradientStart && { gradientStart: dto.gradientStart }),
      ...(dto.gradientEnd && { gradientEnd: dto.gradientEnd }),
      ...(dto.gradientDirection && {
        gradientDirection: dto.gradientDirection,
      }),
    };

    return this.qrService.update(id, workspaceId, style);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
  ) {
    await this.qrService.remove(id, workspaceId);
    return { message: 'QR code deleted successfully' };
  }
}
