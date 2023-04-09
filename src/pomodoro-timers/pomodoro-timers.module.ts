import { Module } from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedModule } from 'src/utils/modules/shared-module';
import { PomodoroTimersController } from './pomodoro-timers.controller';
import { PomodoroTimersService } from './pomodoro-timers.service';

@Module({
  imports: [SharedModule],
  controllers: [PomodoroTimersController],
  providers: [PomodoroTimersService, PrismaService, GamificationInterceptor],
})
export class PomodoroTimersModule {}
