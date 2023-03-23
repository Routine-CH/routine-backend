import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePomodoroTimerDto {
  @IsNotEmpty()
  @IsNumber()
  startTime: number;

  @IsNotEmpty()
  @IsNumber()
  stopTime: number;
}
