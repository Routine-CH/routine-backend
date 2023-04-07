import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateGoalRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public importance: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public vision: string;
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

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public importance: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public vision: string;

  public completed?: string;
}

export class UpdateGoalDto extends CreateGoalDto {}
