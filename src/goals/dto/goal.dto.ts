import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateTodoDto, TodoDto } from 'src/todos/dto/todo.dto';

export class CreateGoalRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public description: string;

  @IsArray()
  @MaxLength(5)
  @ValidateNested({ each: true })
  @Type(() => TodoDto)
  public todos?: TodoDto[];
}

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public title: string;

  @IsString()
  public imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public description: string;

  public completed?: string;

  @IsArray()
  @ArrayMinSize(0)
  @MaxLength(5)
  @IsOptional()
  public todos?: CreateTodoDto[];
}

export class UpdateGoalDto {
  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public imageUrl?: string;

  @IsString()
  @IsOptional()
  public description?: string;

  public completed?: boolean;

  @IsArray()
  @ArrayMinSize(0)
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TodoDto)
  public todos?: TodoDto[];
}
