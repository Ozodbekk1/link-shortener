import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto, AssignRoleDto } from './dto/roles.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const { permissionIds, ...roleData } = dto;

    return this.prisma.role.create({
      data: {
        ...roleData,
        permissions: permissionIds?.length
          ? {
              create: permissionIds.map((id) => ({
                permission: { connect: { id } },
              })),
            }
          : undefined,
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findAll(organizationId?: string) {
    return this.prisma.role.findMany({
      where: organizationId ? { organizationId } : {},
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateRoleDto) {
    const { permissionIds, ...roleData } = dto;

    const roleExists = await this.prisma.role.findUnique({ where: { id } });
    if (!roleExists) throw new NotFoundException('Role not found');

    return this.prisma.$transaction(async (tx) => {
      if (permissionIds) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });

        if (permissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
              roleId: id,
              permissionId,
            })),
          });
        }
      }

      return tx.role.update({
        where: { id },
        data: roleData,
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      });
    });
  }

  async delete(id: string) {
    const roleExists = await this.prisma.role.findUnique({ where: { id } });
    if (!roleExists) throw new NotFoundException('Role not found');

    return this.prisma.role.delete({
      where: { id },
    });
  }

  async assignRoleToUser(dto: AssignRoleDto) {
    const { userId, organizationId } = dto;

    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: { organizationId, userId },
      },
    });

    if (!membership) {
      throw new NotFoundException('User is not a member of this organization');
    }

    return this.prisma.organizationMember.update({
      where: {
        organizationId_userId: { organizationId, userId },
      },
      data: {},
    });
  }
}
