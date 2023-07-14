import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// check if images array is 5 or less
@ValidatorConstraint({ name: 'hasMaxFiveImages' })
export class HasMaxFiveImagesValidator implements ValidatorConstraintInterface {
  validate(images: ImageDto[]): boolean {
    return images.length <= 5;
  }

  defaultMessage(): string {
    return 'Too many images - maximum is 5';
  }
}

class ImageDto {
  @IsString()
  public imageUrl: string;
}

export class CreateNoteRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public description: string;

  @IsArray()
  @Validate(HasMaxFiveImagesValidator)
  @IsOptional()
  @Type(() => ImageDto)
  @ValidateNested({ each: true })
  public images?: ImageDto[];
}

export class UpdateNoteRequestDto {
  @IsString()
  @IsOptional()
  @MinLength(5)
  public title?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  public description?: string;

  @IsArray()
  @Validate(HasMaxFiveImagesValidator)
  @IsOptional()
  @Type(() => ImageDto)
  @ValidateNested({ each: true })
  public images?: ImageDto[];
}
