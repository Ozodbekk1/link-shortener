import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import {
  PermissionAction,
  PermissionResource,
} from '../../common/constants/permissions.constants';
import { RequirePermission } from '../../common/decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequirePermission(PermissionAction.CREATE, PermissionResource.WORKSPACES)
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
  @RequirePermission(PermissionAction.READ, PermissionResource.WORKSPACES)
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @RequirePermission(PermissionAction.READ, PermissionResource.WORKSPACES)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(PermissionAction.UPDATE, PermissionResource.WORKSPACES)
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(PermissionAction.DELETE, PermissionResource.WORKSPACES)
  delete(@Param('id') id: string) {
    return this.permissionsService.delete(id);
  }
}
