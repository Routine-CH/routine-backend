import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'johndoe' })
  @Length(4, 16, { message: 'Username must be between 4 and 16 characters' })
  public username: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Password!1234' })
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  public password: string;
}

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'johndoe' })
  public username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Password!1234' })
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  public password: string;
}
