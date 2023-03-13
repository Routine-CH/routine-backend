import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJournalDto {
  @IsString()
  @IsNotEmpty()
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
