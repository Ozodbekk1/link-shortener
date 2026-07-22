import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { QrStyle } from './interfaces/qr-style.interface';
import * as QRCode from 'qrcode';
import sharp from 'sharp';

@Injectable()
export class QrService {
  private readonly logger = new Logger(QrService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateQrImageBuffer(
    text: string,
    style: QrStyle = {},
  ): Promise<Buffer> {
    const {
      foregroundColor = '#000000',
      backgroundColor = '#ffffff',
      size = 400,
      margin = 2,
      dotStyle = 'square',
      cornerStyle = 'square',
      gradientStart,
      gradientEnd,
      gradientDirection = 'horizontal',
      logoUrl,
      logoSize = 0.2,
    } = style;

    const qrDataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
      errorCorrectionLevel: 'H', // High error correction for logo overlay
    });

    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    let qrBuffer: Buffer = Buffer.from(base64Data, 'base64');

    if (dotStyle !== 'square' || cornerStyle !== 'square') {
      qrBuffer = await this.applyModuleStyles(
        qrBuffer,
        dotStyle,
        cornerStyle,
        foregroundColor,
        backgroundColor,
        size,
        margin,
      );
    }

    if (gradientStart && gradientEnd) {
      qrBuffer = await this.applyGradient(
        qrBuffer,
        gradientStart,
        gradientEnd,
        gradientDirection,
      );
    }

    if (logoUrl) {
      qrBuffer = await this.overlayLogo(qrBuffer, logoUrl, logoSize, size);
    }

    return qrBuffer;
  }

  async create(workspaceId: string, linkId: string, style: QrStyle = {}) {
    const link = await this.prisma.link.findFirst({
      where: { id: linkId, workspaceId },
    });

    if (!link) {
      throw new NotFoundException(
        `Link with ID ${linkId} not found in this workspace`,
      );
    }

    const imageBuffer = await this.generateQrImageBuffer(
      link.originalUrl,
      style,
    );

    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    const qrCode = await this.prisma.qRCode.create({
      data: {
        linkId,
        imageUrl: dataUrl,
        styleJson: style as any,
      },
      include: {
        link: {
          select: {
            id: true,
            shortSlug: true,
            title: true,
            originalUrl: true,
          },
        },
      },
    });

    this.logger.log(`QR code created: ${qrCode.id} for link: ${linkId}`);

    return {
      qrCode,
      imageUrl: dataUrl,
    };
  }

  async findAll(workspaceId: string, linkId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {
      link: { workspaceId },
      ...(linkId && { linkId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.qRCode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          link: {
            select: {
              id: true,
              shortSlug: true,
              title: true,
              originalUrl: true,
            },
          },
        },
      }),
      this.prisma.qRCode.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { id },
      include: {
        link: {
          select: {
            id: true,
            shortSlug: true,
            title: true,
            originalUrl: true,
          },
        },
      },
    });

    if (!qrCode) {
      throw new NotFoundException(`QR code with ID ${id} not found`);
    }

    return qrCode;
  }

  async update(id: string, workspaceId: string, style: Partial<QrStyle>) {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { id },
      include: {
        link: {
          select: { id: true, originalUrl: true, workspaceId: true },
        },
      },
    });

    if (!qrCode) {
      throw new NotFoundException(`QR code with ID ${id} not found`);
    }

    if (qrCode.link.workspaceId !== workspaceId) {
      throw new NotFoundException(
        `QR code with ID ${id} not found in this workspace`,
      );
    }

    const mergedStyle: QrStyle = {
      ...(qrCode.styleJson as unknown as QrStyle),
      ...style,
    };

    const imageBuffer = await this.generateQrImageBuffer(
      qrCode.link.originalUrl,
      mergedStyle,
    );
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Update in DB
    const updated = await this.prisma.qRCode.update({
      where: { id },
      data: {
        imageUrl: dataUrl,
        styleJson: mergedStyle as any,
      },
      include: {
        link: {
          select: {
            id: true,
            shortSlug: true,
            title: true,
            originalUrl: true,
          },
        },
      },
    });

    return {
      qrCode: updated,
      imageUrl: dataUrl,
    };
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { id },
      include: {
        link: { select: { workspaceId: true } },
      },
    });

    if (!qrCode) {
      throw new NotFoundException(`QR code with ID ${id} not found`);
    }

    if (qrCode.link.workspaceId !== workspaceId) {
      throw new NotFoundException(
        `QR code with ID ${id} not found in this workspace`,
      );
    }

    await this.prisma.qRCode.delete({ where: { id } });
    this.logger.log(`QR code deleted: ${id}`);
  }

  async getQrImageBuffer(id: string): Promise<Buffer> {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { id },
      include: {
        link: { select: { originalUrl: true } },
      },
    });

    if (!qrCode) {
      throw new NotFoundException(`QR code with ID ${id} not found`);
    }

    const style = qrCode.styleJson as unknown as QrStyle;
    return this.generateQrImageBuffer(qrCode.link.originalUrl, style);
  }

  private async applyModuleStyles(
    imageBuffer: Buffer,
    dotStyle: 'square' | 'dot' | 'rounded',
    cornerStyle: 'square' | 'dot' | 'rounded',
    fgColor: string,
    bgColor: string,
    size: number,
    margin: number,
  ): Promise<Buffer> {
    const { data, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const pixels = new Uint8ClampedArray(data);

    const fg = this.parseHexColor(fgColor);
    const bg = this.parseHexColor(bgColor);

    const moduleCount = this.detectModuleCount(width, margin);

    if (!moduleCount) {
      return imageBuffer;
    }

    const moduleSize = Math.floor(width / moduleCount);
    const offset = Math.floor((width - moduleSize * moduleCount) / 2);

    const isFinderPattern = (
      row: number,
      col: number,
      modCount: number,
    ): boolean => {
      const finderSize = 7;
      if (row < finderSize && col < finderSize) return true;
      if (row < finderSize && col >= modCount - finderSize) return true;
      if (row >= modCount - finderSize && col < finderSize) return true;
      return false;
    };

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        const cx = offset + col * moduleSize + moduleSize / 2;
        const cy = offset + row * moduleSize + moduleSize / 2;
        const centerIdx = (Math.round(cy) * width + Math.round(cx)) * channels;

        const isDark = pixels[centerIdx] < 128 && pixels[centerIdx + 3] > 128;
        if (!isDark) continue;

        const isFinder = isFinderPattern(row, col, moduleCount);
        const style = isFinder ? cornerStyle : dotStyle;
        if (style === 'square') continue;

        const radius = style === 'dot' ? moduleSize * 0.45 : moduleSize * 0.42;

        for (
          let py = offset + row * moduleSize;
          py < offset + (row + 1) * moduleSize;
          py++
        ) {
          for (
            let px = offset + col * moduleSize;
            px < offset + (col + 1) * moduleSize;
            px++
          ) {
            if (py >= 0 && py < height && px >= 0 && px < width) {
              const idx = (py * width + px) * channels;
              pixels[idx] = bg[0];
              pixels[idx + 1] = bg[1];
              pixels[idx + 2] = bg[2];
              pixels[idx + 3] = 255;
            }
          }
        }

        for (let angle = 0; angle < 360; angle += 2) {
          const rad = (angle * Math.PI) / 180;
          for (let r = 0; r < radius; r++) {
            const px = Math.round(cx + r * Math.cos(rad));
            const py = Math.round(cy + r * Math.sin(rad));
            if (py >= 0 && py < height && px >= 0 && px < width) {
              const idx = (py * width + px) * channels;
              pixels[idx] = fg[0];
              pixels[idx + 1] = fg[1];
              pixels[idx + 2] = fg[2];
              pixels[idx + 3] = 255;
            }
          }
        }
      }
    }

    return sharp(Buffer.from(pixels.buffer), {
      raw: { width, height, channels },
    })
      .png()
      .toBuffer();
  }

  private detectModuleCount(width: number, margin: number): number | null {
    for (let v = 0; v <= 40; v++) {
      const modules = 21 + 4 * v;
      const totalModules = modules + 2 * margin;
      if (width % totalModules === 0 || width % modules === 0) {
        return modules;
      }
    }
    return null;
  }

  private async applyGradient(
    imageBuffer: Buffer,
    gradientStart: string,
    gradientEnd: string,
    direction: 'horizontal' | 'vertical' | 'diagonal',
  ): Promise<Buffer> {
    const metadata = await sharp(imageBuffer).metadata();
    const imgWidth = metadata.width || 400;
    const imgHeight = metadata.height || 400;

    const gradient = await this.createGradientImage(
      imgWidth,
      imgHeight,
      gradientStart,
      gradientEnd,
      direction,
    );

    return sharp(imageBuffer)
      .composite([{ input: gradient, blend: 'multiply' }])
      .png()
      .toBuffer();
  }

  private async createGradientImage(
    width: number,
    height: number,
    startColor: string,
    endColor: string,
    direction: 'horizontal' | 'vertical' | 'diagonal',
  ): Promise<Buffer> {
    const channels = 4;
    const data = new Uint8ClampedArray(width * height * channels);

    const start = this.parseHexColor(startColor);
    const end = this.parseHexColor(endColor);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let t: number;
        switch (direction) {
          case 'horizontal':
            t = x / width;
            break;
          case 'vertical':
            t = y / height;
            break;
          case 'diagonal':
            t = (x + y) / (width + height);
            break;
          default:
            t = x / width;
        }

        const idx = (y * width + x) * channels;
        data[idx] = Math.round(start[0] + (end[0] - start[0]) * t);
        data[idx + 1] = Math.round(start[1] + (end[1] - start[1]) * t);
        data[idx + 2] = Math.round(start[2] + (end[2] - start[2]) * t);
        data[idx + 3] = 255;
      }
    }

    return sharp(Buffer.from(data.buffer), {
      raw: { width, height, channels },
    })
      .png()
      .toBuffer();
  }

  private async overlayLogo(
    qrBuffer: Buffer,
    logoUrl: string,
    logoSize: number,
    qrSize: number,
  ): Promise<Buffer> {
    try {
      let logoBuffer: Buffer;

      if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
        const response = await fetch(logoUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        logoBuffer = Buffer.from(arrayBuffer);
      } else if (logoUrl.startsWith('data:')) {
        const base64Data = logoUrl.replace(/^data:image\/\w+;base64,/, '');
        logoBuffer = Buffer.from(base64Data, 'base64');
      } else {
        this.logger.warn(
          `Unsupported logo URL format: ${logoUrl.substring(0, 50)}`,
        );
        return qrBuffer;
      }

      const logoWidth = Math.round(qrSize * logoSize);
      const logoHeight = Math.round(qrSize * logoSize);

      const resizedLogo = await sharp(logoBuffer)
        .resize(logoWidth, logoHeight, { fit: 'contain' })
        .png()
        .toBuffer();

      const logoBgSize = Math.round(logoWidth * 1.2);
      const svgBg = Buffer.from(
        `<svg width="${logoBgSize}" height="${logoBgSize}">
          <rect width="100%" height="100%" rx="${logoBgSize * 0.15}" fill="white"/>
        </svg>`,
      );

      const bgRounded = await sharp(svgBg)
        .resize(logoWidth, logoHeight)
        .png()
        .toBuffer();

      const logoWithBg = await sharp(bgRounded)
        .composite([{ input: resizedLogo, blend: 'over', gravity: 'center' }])
        .png()
        .toBuffer();

      const left = Math.round((qrSize - logoWidth) / 2);
      const top = Math.round((qrSize - logoHeight) / 2);

      return sharp(qrBuffer)
        .composite([{ input: logoWithBg, top, left, blend: 'over' }])
        .png()
        .toBuffer();
    } catch (error: any) {
      this.logger.warn(
        `Failed to overlay logo: ${error?.message || 'Unknown error'}. Returning QR without logo.`,
      );
      return qrBuffer;
    }
  }

  private parseHexColor(hex: string): [number, number, number] {
    hex = hex.replace('#', '');

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
  }
}
