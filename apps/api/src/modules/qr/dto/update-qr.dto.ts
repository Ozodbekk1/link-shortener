import { PartialType, OmitType } from '@nestjs/mapped-types';
import { GenerateQrDto } from './generate-qr.dto';

export class UpdateQrDto extends PartialType(
  OmitType(GenerateQrDto, ['linkId'] as const),
) {}
