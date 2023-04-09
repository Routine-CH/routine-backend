import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Todo } from 'src/utils/types';

// check if todo array is 5 or less
@ValidatorConstraint({ name: 'hasMaxFiveTodos' })
export class HasMaxFiveTodosValidator implements ValidatorConstraintInterface {
  validate(todos: Todo[]): boolean {
    return todos.length <= 5;
  }

  defaultMessage(): string {
    return 'Too many todos - maximum is 5';
  }
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
  @Validate(HasMaxFiveTodosValidator)
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

  @IsBoolean()
  public completed?: string;

  @IsArray()
  @Validate(HasMaxFiveTodosValidator)
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

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  public completed?: boolean;

  @IsArray()
  @Validate(HasMaxFiveTodosValidator)
  @IsOptional()
  public todos?: Todo[];
}
