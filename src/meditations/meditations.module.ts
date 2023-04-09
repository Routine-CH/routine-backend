import { Module } from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedModule } from 'src/utils/modules/shared-module';
import { MeditationsController } from './meditations.controller';
import { MeditationsService } from './meditations.service';

@Module({
  imports: [SharedModule],
  controllers: [MeditationsController],
  providers: [MeditationsService, PrismaService, GamificationInterceptor],
})
export class MeditationsModule {}
