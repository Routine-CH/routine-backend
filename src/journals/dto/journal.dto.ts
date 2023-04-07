import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateJournalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public title: string;

  @IsString()
  @IsNotEmpty()
  public mood: string;

  @IsString()
  @IsNotEmpty()
  public moodDescription: string;

  @IsString()
  @IsNotEmpty()
  public activity: string;

  @IsString()
  @IsNotEmpty()
  public toImprove: string;
}

export class UpdateJournalDto extends CreateJournalDto {}
