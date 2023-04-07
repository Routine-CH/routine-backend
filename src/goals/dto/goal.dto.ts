import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { Todo } from 'src/utils/types';

function hasMaxFiveTodos(todos: Todo[]) {
  return todos.length <= 5;
}

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
  @Validate(hasMaxFiveTodos, { message: 'Too many todos - maximum is 5' })
  @IsOptional()
  public todos?: Todo[];
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
  @Validate(hasMaxFiveTodos, { message: 'Too many todos - maximum is 5' })
  @IsOptional()
  public todos?: Todo[];
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
  @Validate(hasMaxFiveTodos, { message: 'Too many todos - maximum is 5' })
  @IsOptional()
  public todos?: Todo[];
}
