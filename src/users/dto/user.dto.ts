import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  @ValidateIf((o) => o.oldPassword !== undefined && o.newPassword !== null)
  oldPassword?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  @ValidateIf((o) => o.newPassword !== undefined && o.newPassword !== null)
  newPassword?: string;

  @IsArray()
  @IsOptional()
  tools?: string;
}
