import { Module } from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';

@Module({
  controllers: [JournalsController],
  providers: [JournalsService, PrismaService, GamificationInterceptor],
})
export class JournalsModule {}
