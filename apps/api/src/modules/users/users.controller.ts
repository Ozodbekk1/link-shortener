import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  getall() {
    return this.userService.findall();
  }
}
