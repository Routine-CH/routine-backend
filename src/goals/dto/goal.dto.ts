import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateGoalRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  public importance: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  public vision: string;
}

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  public title: string;

  @IsString()
  @ApiProperty({ required: false })
  public imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  public importance: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  public vision: string;

  @IsBoolean()
  @ApiProperty({ required: false })
  public completed?: boolean;
}

export class UpdateGoalDto extends PartialType(CreateGoalDto) {}