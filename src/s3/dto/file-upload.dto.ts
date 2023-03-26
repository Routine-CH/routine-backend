import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FileUploadDto {
  @IsOptional()
  @ApiProperty({
    type: 'file',
    description: 'Optional avatar image',
    required: false,
    format: 'binary',
  })
  avatar?: Express.Multer.File | undefined;
}
