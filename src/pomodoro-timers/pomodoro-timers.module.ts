import { Module } from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { SharedModule } from 'src/utils/modules/shared-module';
import { PomodoroTimersController } from './pomodoro-timers.controller';
import { PomodoroTimersService } from './pomodoro-timers.service';

@Module({
  imports: [SharedModule],
  controllers: [PomodoroTimersController],
  providers: [
    PomodoroTimersService,
    PrismaService,
    GamificationInterceptor,
    S3Service,
  ],
})
export class PomodoroTimersModule {}
