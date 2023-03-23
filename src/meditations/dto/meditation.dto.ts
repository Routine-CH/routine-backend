import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMeditationDto {
  @IsNotEmpty()
  @IsNumber()
  startTime: number;

  @IsNotEmpty()
  @IsNumber()
  stopTime: number;
}
