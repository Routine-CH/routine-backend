import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
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
