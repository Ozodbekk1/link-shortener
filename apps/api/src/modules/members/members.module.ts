import { Module } from '@nestjs/common';
import { TeamMembersService } from './members.service';
import { TeamMembersController } from './members.controller';

@Module({
  providers: [TeamMembersService],
  controllers: [TeamMembersController],
})
export class MembersModule {}
