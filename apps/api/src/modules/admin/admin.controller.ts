import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/constants/role.enums';
import { UserStatus } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/overview')
  @Roles(Role.ADMIN)
  async getOverview() {
    return this.adminService.getOverview();
  }

  @Get('dashboard/daily-stats')
  @Roles(Role.ADMIN)
  async getDailyStats(@Query('days') days?: number) {
    return this.adminService.getDailyStats(days ? Number(days) : 30);
  }

  @Get('users')
  @Roles(Role.ADMIN)
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: UserStatus,
  ) {
    return this.adminService.getUsers(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      search,
      status,
    );
  }

  @Patch('users/:id/status')
  @Roles(Role.ADMIN)
  async updateUserStatus(
    @Param('id') id: string,
    @Query('status') status: UserStatus,
  ) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Get('links')
  @Roles(Role.ADMIN)
  async getLinks(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getLinks(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      search,
    );
  }

  @Get('organizations')
  @Roles(Role.ADMIN)
  async getOrganizations(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getOrganizations(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get('analytics/top-links')
  @Roles(Role.ADMIN)
  async getTopLinks(@Query('limit') limit?: number) {
    return this.adminService.getTopLinks(limit ? Number(limit) : 10);
  }

  @Get('analytics/devices')
  @Roles(Role.ADMIN)
  async getDeviceAnalytics() {
    return this.adminService.getDeviceAnalytics();
  }
}
