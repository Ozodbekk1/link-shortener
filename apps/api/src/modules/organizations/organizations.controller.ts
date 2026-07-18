import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  async createOrganization(
    @Body() dto: CreateOrganizationDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub as string;
    return this.orgService.createOrganization(dto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllOrganizations(@Req() req: any) {
    const userId = req.user.sub as string;
    return this.orgService.getAllOrganizations(userId);
  }

  @Delete(':organizationId')
  @UseGuards(JwtAuthGuard)
  async deleteOrganization(
    @Req() req: any,
    @Param('organizationId') organizationId: string,
  ) {
    const userId = req.user.sub as string;

    return this.orgService.deleteOrganization(userId, organizationId);
  }

  @Get(':organizationId')
  @UseGuards(JwtAuthGuard)
  async getOrganizationById(
    @Req() req: any,
    @Param('organizationId') organizationId: string,
  ) {
    const userId = req.user.sub as string;

    return this.orgService.getOrganizationById(userId, organizationId);
  }

  @Get(':organizationId/members')
  @UseGuards(JwtAuthGuard)
  async getOrganizationMembers(
    @Req() req: any,
    @Param('organizationId') organizationId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const userId = req.user.sub as string;

    return this.orgService.getOrganizationMembers(
      userId,
      organizationId,
      Number(page),
      Number(limit),
    );
  }
}
