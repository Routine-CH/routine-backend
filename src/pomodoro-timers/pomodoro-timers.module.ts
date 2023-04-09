import { Module } from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { PomodoroTimersController } from './pomodoro-timers.controller';
import { PomodoroTimersService } from './pomodoro-timers.service';

@Module({
  controllers: [PomodoroTimersController],
  providers: [PomodoroTimersService, PrismaService, GamificationInterceptor],
})
export class PomodoroTimersModule {}
