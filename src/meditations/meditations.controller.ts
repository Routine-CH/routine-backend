import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Meditation } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';
import { CreateMeditationDto } from './dto/meditation.dto';

import { MeditationsService } from './meditations.service';

@Controller('meditations')
export class MeditationsController {
  constructor(private readonly meditationsService: MeditationsService) {}

  // get meditation by user id
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns total meditation duration of JWT Token user',
    type: Meditation,
  })
  @ApiNotFoundResponse({
    description: 'No meditation record found for this user',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getMeditationByUserId(@Req() req: CustomRequest) {
    return await this.meditationsService.getMeditationByUserId(req.user.id);
  }

  // post a meditation
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns total meditation duration of JWT Token user',
    type: Meditation,
  })
  @ApiBody({
    description: 'Send a meditation duration in seconds',
    type: CreateMeditationDto,
  })
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
