import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateQrDto {
  @IsUUID()
  @IsString()
  linkId!: string;

  @IsOptional()
  @IsString()
  foregroundColor?: string;

  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(2000)
  @Type(() => Number)
  size?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  margin?: number;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.05)
  @Max(0.5)
  @Type(() => Number)
  logoSize?: number;

  @IsOptional()
  @IsEnum(['square', 'dot', 'rounded'])
  dotStyle?: 'square' | 'dot' | 'rounded';

  @IsOptional()
  @IsEnum(['square', 'dot', 'rounded'])
  cornerStyle?: 'square' | 'dot' | 'rounded';

  @IsOptional()
  @IsString()
  gradientStart?: string;

  @IsOptional()
  @IsString()
  gradientEnd?: string;

  @IsOptional()
  @IsEnum(['horizontal', 'vertical', 'diagonal'])
  gradientDirection?: 'horizontal' | 'vertical' | 'diagonal';
}
