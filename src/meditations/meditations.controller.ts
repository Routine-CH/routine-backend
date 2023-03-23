import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CustomRequest } from 'src/utils/types';
import { CreateMeditationDto } from './dto/meditation.dto';

import { MeditationsService } from './meditations.service';

@Controller('meditations')
export class MeditationsController {
  constructor(private readonly meditationsService: MeditationsService) {}

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
