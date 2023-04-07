import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePomodoroTimerDto {
  @IsNotEmpty()
  @IsNumber()
  durationInSeconds: number;
}
