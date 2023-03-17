import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  oldPassword?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  newPassword?: string;
}
