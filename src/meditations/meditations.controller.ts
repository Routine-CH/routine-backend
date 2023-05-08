import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { createResponse } from 'src/utils/helper/functions';
import { CustomRequest } from 'src/utils/types';
import { CreateMeditationDto } from './dto/meditation.dto';
import { MeditationsService } from './meditations.service';

@Controller('meditations')
export class MeditationsController {
  constructor(private readonly meditationsService: MeditationsService) {}

  // get meditation by user id
  @Get()
  @UseGuards(JwtAuthGuard)
  async getMeditationByUserId(@Req() req: CustomRequest) {
    const result = await this.meditationsService.getMeditationByUserId(
      req.user.id,
    );
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // post a meditation
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async upsertMeditation(
    @Body() createMeditationDto: CreateMeditationDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.meditationsService.upsertMeditation(
      createMeditationDto,
      req.user.id,
    );
    return createResponse(HttpStatus.OK, result.message, result.data);
  }
}
