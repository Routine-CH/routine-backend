import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { createResponse } from 'src/utils/helper/functions';
import { BadgesService } from './badges.service';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  // get badge by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getBadgeById(@Param() params: { id: string }) {
    const result = await this.badgesService.getBadgeById(params.id);
    return createResponse(undefined, result.data);
  }
}
