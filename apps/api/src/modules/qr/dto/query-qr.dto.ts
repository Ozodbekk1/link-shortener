import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryQrDto {
  @IsOptional()
  @IsUUID()
  @IsString()
  linkId?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
