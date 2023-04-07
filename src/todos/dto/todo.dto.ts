import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
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
