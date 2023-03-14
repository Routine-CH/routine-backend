import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
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

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  public plannedDate: Date;

  @IsBoolean()
  @ApiProperty()
  public completed?: boolean;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
