import { Module } from '@nestjs/common';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamsModule {}
