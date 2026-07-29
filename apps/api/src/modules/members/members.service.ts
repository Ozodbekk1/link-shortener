import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { TeamRole } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { AddTeamMemberDto, UpdateTeamMemberRoleDto } from './dto/member.dto';

@Injectable()
export class TeamMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async addMember(teamId: string, dto: AddTeamMemberDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        workspace: {
          select: { organizationId: true },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const organizationId = team.workspace.organizationId;

    return this.prisma.$transaction(async (tx) => {
      await tx.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId,
            userId: dto.userId,
          },
        },
        create: {
          organizationId,
          userId: dto.userId,
          role: 'MEMBER',
        },
        update: {},
      });

      const existingTeamMember = await tx.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: dto.userId,
          },
        },
      });

      if (existingTeamMember) {
        throw new ConflictException('User is already a member of this team');
      }

      return tx.teamMember.create({
        data: {
          teamId,
          userId: dto.userId,
          role: dto.role ?? TeamRole.MEMBER,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      });
    });
  }

  async getTeamMembers(teamId: string) {
    return this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async updateMemberRole(
    teamId: string,
    memberId: string,
    dto: UpdateTeamMemberRoleDto,
  ) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.teamId !== teamId) {
      throw new NotFoundException('Team member not found');
    }

    if (member.role === TeamRole.OWNER && dto.role !== TeamRole.OWNER) {
      const ownerCount = await this.prisma.teamMember.count({
        where: { teamId, role: TeamRole.OWNER },
      });
      if (ownerCount <= 1) {
        throw new ForbiddenException('Cannot demote the sole team owner');
      }
    }

    return this.prisma.teamMember.update({
      where: { id: memberId },
      data: { role: dto.role },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });
  }

  async removeMember(teamId: string, memberId: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.teamId !== teamId) {
      throw new NotFoundException('Team member not found');
    }

    if (member.role === TeamRole.OWNER) {
      const ownerCount = await this.prisma.teamMember.count({
        where: { teamId, role: TeamRole.OWNER },
      });
      if (ownerCount <= 1) {
        throw new ForbiddenException('Cannot remove the sole team owner');
      }
    }

    return this.prisma.teamMember.delete({
      where: { id: memberId },
    });
  }
}
