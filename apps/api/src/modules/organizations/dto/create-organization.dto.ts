import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 25, { message: 'Subdomain must be between 3 and 25 characters.' })
  @Matches(/^[a-z0-9]+$/, {
    message:
      'The slug must be a single word containing only lowercase letters and numbers (no spaces, dashes, or symbols).',
  })
  slug!: string; // The tenant subdomain
}
