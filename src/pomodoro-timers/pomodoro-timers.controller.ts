import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
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
    return await this.pomodoroTimersService.getPomodoroTimerByUserId(
      req.user.id,
    );
  }

  // post a pomodoro timer
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async upsertPomodoroTImer(
    @Body() createPomodoroTimerDto: CreatePomodoroTimerDto,
    @Req() req: CustomRequest,
  ) {
    return this.pomodoroTimersService.upsertPomodoroTimer(
      createPomodoroTimerDto,
      req.user.id,
    );
  }
}
