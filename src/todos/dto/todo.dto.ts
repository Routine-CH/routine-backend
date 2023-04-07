import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public description: string;

  @IsDateString()
  @IsNotEmpty()
  public plannedDate: Date;

  @IsBoolean()
  public completed?: boolean;
}

export class UpdateTodoDto extends CreateTodoDto {}

export class TodoDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public plannedDate: Date;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
