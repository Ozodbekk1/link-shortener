import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  action!: string; // e.g., 'create', 'read', 'update', 'delete'

  @IsString()
  @IsNotEmpty()
  resource!: string; // e.g., 'links', 'campaigns', 'workspaces'
}

export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  resource?: string;
}
