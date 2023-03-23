import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PomodoroTimersController } from './pomodoro-timers.controller';
import { PomodoroTimersService } from './pomodoro-timers.service';

@Module({
  controllers: [PomodoroTimersController],
  providers: [PomodoroTimersService, PrismaService],
})
export class PomodoroTimersModule {}
