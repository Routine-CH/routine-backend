import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { CreatePomodoroTimerDto } from './dto/pomodoro-timer.dto';
import { PomodoroTimersService } from './pomodoro-timers.service';

@Controller('pomodoro-timers')
export class PomodoroTimersController {
  constructor(private readonly pomodoroTimersService: PomodoroTimersService) {}

  // get pomodor-timer by user id
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPomodoroTimerByUserId(@Req() req: CustomRequest) {
    const result = await this.pomodoroTimersService.getPomodoroTimerByUserId(
      req.user.id,
    );
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // post a pomodoro timer
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async upsertPomodoroTImer(
    @Body() createPomodoroTimerDto: CreatePomodoroTimerDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.pomodoroTimersService.upsertPomodoroTimer(
      createPomodoroTimerDto,
      req.user.id,
    );
    return createResponse(HttpStatus.OK, result.message, result.data);
  }
}
