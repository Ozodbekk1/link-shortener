import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { OrganizationRole, TeamRole } from '@prisma/client';

export class AddTeamMemberDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(TeamRole)
  role?: TeamRole = TeamRole.MEMBER;
}

export class UpdateTeamMemberRoleDto {
  @IsEnum(TeamRole)
  @IsNotEmpty()
  role!: TeamRole;
}

export class InviteTeamMemberDto {
  @IsEmail()
  email!: string;

  @IsEnum(TeamRole)
  @IsOptional()
  teamRole?: TeamRole = TeamRole.MEMBER;

  @IsEnum(OrganizationRole)
  @IsOptional()
  orgRole?: OrganizationRole = OrganizationRole.MEMBER;
}

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
