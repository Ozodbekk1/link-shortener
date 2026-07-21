import {
  IsString,
  IsUrl,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RedirectType } from '@prisma/client';

export class RedirectRuleDto {
  @IsEnum(RedirectType)
  type!: RedirectType;

  @IsString()
  value!: string;

  @IsUrl()
  destinationUrl!: string;
}

export class CreateLinkDto {
  @IsUrl()
  originalUrl!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Slug can only contain letters, numbers, hyphens, and underscores',
  })
  shortSlug!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;

  @IsOptional()
  @IsString()
  customDomain?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  clickLimit?: number;

  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date;

  @IsOptional()
  @IsBoolean()
  passwordProtected?: boolean;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RedirectRuleDto)
  redirectRules?: RedirectRuleDto[];
}
