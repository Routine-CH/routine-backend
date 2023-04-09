import { Module } from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedModule } from 'src/utils/modules/shared-module';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';

@Module({
  imports: [SharedModule],
  controllers: [JournalsController],
  providers: [JournalsService, PrismaService, GamificationInterceptor],
})
export class JournalsModule {}
