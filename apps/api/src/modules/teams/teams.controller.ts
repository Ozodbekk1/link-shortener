import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { TeamService } from './teams.service';
import { CreateTeamDto, GetTeamsDto } from './dto/teams.dto';
import { AuthTokenPayload } from '../auth/strategies/jwt/jwt.types';
import { WorkspaceMemberGuard } from './guard/workspace.guard';

@Controller('workspaces/:workspaceId/teams')
@UseGuards(JwtAuthGuard, WorkspaceMemberGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateTeamDto,
    @Req() req: Request & { user?: AuthTokenPayload },
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.teamService.create(workspaceId, userId, dto);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Query() query: GetTeamsDto,
  ) {
    return this.teamService.findAll(workspaceId, query);
  }

  @Get(':teamId')
  findOne(@Param('teamId') teamId: string) {
    return this.teamService.findOne(teamId);
  }
}
