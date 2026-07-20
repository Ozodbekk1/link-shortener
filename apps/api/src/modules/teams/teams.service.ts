import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
import { TeamRole } from '@prisma/client';
import { CreateTeamDto, GetTeamsDto } from './dto/teams.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, userId: string, dto: CreateTeamDto) {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const exists = await this.prisma.team.findFirst({
      where: {
        workspaceId,
        name: dto.name,
      },
    });

    if (exists) {
      throw new ConflictException(
        'A team with this name already exists in the workspace',
      );
    }

    return this.prisma.team.create({
      data: {
        workspaceId,
        name: dto.name,
        members: {
          create: {
            userId,
            role: TeamRole.OWNER,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(workspaceId: string, query: GetTeamsDto) {
    const { page, limit, search } = query;

    const skip = (page - 1) * limit;

    const where = {
      workspaceId,
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    };

    const [teams, total] = await this.prisma.$transaction([
      this.prisma.team.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.team.count({
        where,
      }),
    ]);

    return {
      data: teams,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId,
      },

      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },

          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }
}
