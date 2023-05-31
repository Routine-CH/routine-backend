// update-favourite-tools.dto.ts

import { IsArray, IsString } from 'class-validator';

export class UpdateFavouriteToolsDto {
  @IsArray()
  @IsString({ each: true })
  toolIds: string[];
}
