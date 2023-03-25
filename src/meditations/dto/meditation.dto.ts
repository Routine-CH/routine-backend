import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMeditationDto {
  @IsNotEmpty()
  @IsNumber()
  durationInSeconds: number;
}
