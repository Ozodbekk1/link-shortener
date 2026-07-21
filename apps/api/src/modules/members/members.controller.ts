import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TeamMembersService } from './members.service';
import { AddTeamMemberDto, UpdateTeamMemberRoleDto } from './dto/member.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('teams/:teamId/members')
@UseGuards(JwtAuthGuard)
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  addMember(@Param('teamId') teamId: string, @Body() dto: AddTeamMemberDto) {
    return this.teamMembersService.addMember(teamId, dto);
  }

  @Get()
  getTeamMembers(@Param('teamId') teamId: string) {
    return this.teamMembersService.getTeamMembers(teamId);
  }

  @Patch(':memberId')
  updateMemberRole(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateTeamMemberRoleDto,
  ) {
    return this.teamMembersService.updateMemberRole(teamId, memberId, dto);
  }

  @Delete(':memberId')
  removeMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamMembersService.removeMember(teamId, memberId);
  }
}
