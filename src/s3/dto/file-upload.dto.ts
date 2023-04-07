import { IsOptional } from 'class-validator';

export class FileUploadDto {
  @IsOptional()
  avatar?: Express.Multer.File | undefined;
}
