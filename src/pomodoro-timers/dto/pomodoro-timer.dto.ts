import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePomodoroTimerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  durationInSeconds: number;
}
