import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class LoginDto {
  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;
}

export class verifyEmailDto {
  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(7)
  otpCode!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  otp!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}
