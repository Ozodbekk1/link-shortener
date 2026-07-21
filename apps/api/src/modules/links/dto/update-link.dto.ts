import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkDto } from './create-link.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { LinkStatus } from '@prisma/client';

export class UpdateLinkDto extends PartialType(CreateLinkDto) {
  @IsOptional()
  @IsEnum(LinkStatus)
  status?: LinkStatus;
}
