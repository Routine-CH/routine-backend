import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { PomodoroTimer } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';
import { CreatePomodoroTimerDto } from './dto/pomodoro-timer.dto';
import { PomodoroTimersService } from './pomodoro-timers.service';

@Controller('pomodoro-timers')
export class PomodoroTimersController {
  constructor(private readonly pomodoroTimersService: PomodoroTimersService) {}

  // get pomodor-timer by user id
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns total pomodoro-timer duration of JWT Token user',
    type: PomodoroTimer,
  })
  @ApiNotFoundResponse({
    description: 'No Pomodoro-Timer record found for this user',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPomodoroTimerByUserId(@Req() req: CustomRequest) {
    return await this.pomodoroTimersService.getPomodoroTimerByUserId(
      req.user.id,
    );
  }

  // post a pomodoro timer
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns total pomodoro-timer duration of JWT Token user',
    type: PomodoroTimer,
  })
  @ApiBody({
    description: 'Send pomodoro-timer duration in seconds',
    type: CreatePomodoroTimerDto,
  })
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
