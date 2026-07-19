import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspaceService: WorkspacesService) {}

  @Post(':organizationId/workspaces')
  @UseGuards(JwtAuthGuard)
  async createWorkspace(
    @Req() req: any,
    @Param('organizationId') organizationId: string,
    @Body() dto: CreateWorkspaceDto,
  ) {
    const userId = req.user.sub as string;

    return await this.workspaceService.createWorkspace(
      userId,
      organizationId,
      dto,
    );
  }

  @Get(':organizationId/workspaces/:workspaceId')
  @UseGuards(JwtAuthGuard)
  async getWorkspace(
    @Req() req: any,
    @Param('organizationId') organizationId: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    const userId = req.user.sub as string;

    return this.workspaceService.getWorkspace(
      userId,
      organizationId,
      workspaceId,
    );
  }

  @Get(':organizationId/workspaces')
  @UseGuards(JwtAuthGuard)
  async getOrganizationWorkspaces(
    @Req() req: any,
    @Param('organizationId') organizationId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const userId = req.user.sub as string;

    return this.workspaceService.getOrganizationWorkspaces(
      userId,
      organizationId,
      Number(page),
      Number(limit),
    );
  }

  @Delete(':organizationId/workspaces/:workspaceId')
  @UseGuards(JwtAuthGuard)
  async deleteWorkspace(
    @Req() req: any,
    @Param('organizationId') organizationId: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    const userId = req.user.sub as string;

    return await this.workspaceService.deleteWorkspace(
      userId,
      organizationId,
      workspaceId,
    );
  }
}
