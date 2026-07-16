import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { AuthTokenPayload } from '../auth/strategies/jwt/jwt.types';
import { JwtService } from '../auth/strategies/jwt/jwt.service';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/constants/role.enums';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: JwtService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request & { user?: AuthTokenPayload }) {
    if (!req.user)
      throw new UnauthorizedException('Missing authenticated user');
    const user = await this.authService.getProfile(req.user.sub);
    return { user };
  }
}
