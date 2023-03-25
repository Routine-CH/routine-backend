import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
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
    return await this.meditationsService.getMeditationByUserId(req.user.id);
  }

  // post a meditation
  @Post()
  @UseGuards(JwtAuthGuard)
  async upsertMeditation(
    @Body() createMeditationDto: CreateMeditationDto,
    @Req() req: CustomRequest,
  ) {
    return this.meditationsService.upsertMeditation(
      createMeditationDto,
      req.user.id,
    );
  }
}
