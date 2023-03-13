import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateJournalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public mood: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public moodDescription: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public activity: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public toImprove: string;
}

export class UpdateJournalDto extends PartialType(CreateJournalDto) {}
