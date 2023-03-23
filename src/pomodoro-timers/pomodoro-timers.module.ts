import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PomodoroTimersController } from './pomodoro-timers.controller';
import { PomodoroTimersService } from './pomodoro-timers.service';

@Module({
  providers: [PomodoroTimersService, PrismaService],
  controllers: [PomodoroTimersController],
})
export class PomodoroTimersModule {}
