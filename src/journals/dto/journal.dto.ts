import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class MoodDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  type: string;
}

export class CreateJournalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public title: string;

  @Type(() => MoodDto)
  @ValidateNested({ each: true })
  public moods: MoodDto[];

  @IsString()
  @IsNotEmpty()
  public moodDescription: string;

  @IsString()
  @IsNotEmpty()
  public activity: string;

  @IsString()
  @IsNotEmpty()
  public toImprove: string;

  @IsString()
  public thoughtsAndIdeas: string;
}

export class UpdateJournalDto extends CreateJournalDto {}
