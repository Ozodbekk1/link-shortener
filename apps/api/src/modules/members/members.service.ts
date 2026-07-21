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

    // 2. Perform atomic auto-provisioning and team creation
    return this.prisma.$transaction(async (tx) => {
      // Step A: Ensure user is added to Organization Member table
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
          role: 'MEMBER', // Default Org role
        },
        update: {}, // No action if user is already an Org member
      });

      // Step B: Check for existing team membership
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

      // Step C: Create team membership
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

  // List all members of a team
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

  // Update member role (OWNER, ADMIN, MEMBER, VIEWER)
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

    // Safety guard: If demoting an OWNER, ensure at least one OWNER remains
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

  // Remove member from team
  async removeMember(teamId: string, memberId: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.teamId !== teamId) {
      throw new NotFoundException('Team member not found');
    }

    // Prevent deleting sole owner
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
