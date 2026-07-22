import {
  Controller,
  Get,
  Param,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import type { AuthTokenPayload } from '../auth/strategies/jwt/jwt.types';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/constants/role.enums';
import { User } from 'src/common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.ADMIN)
  getAllUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.userService.getAllUsers(Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  /**
   * GET /users/me
   * Returns the authenticated user's full profile with all related entities:
   * organizations, workspaces, teams, memberships, links, notifications, etc.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@User() user: AuthTokenPayload) {
    if (!user?.sub)
      throw new UnauthorizedException('Missing authenticated user');
    return this.userService.getUserProfile(user.sub);
  }
}
