import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePermissionDto) {
    const existing = await this.prisma.permission.findUnique({
      where: {
        action_resource: {
          action: dto.action,
          resource: dto.resource,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Permission already exists for this action and resource',
      );
    }

    return this.prisma.permission.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.findOne(id);
    return this.prisma.permission.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.permission.delete({
      where: { id },
    });
  }
}
