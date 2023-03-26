import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMeditationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  durationInSeconds: number;
}
