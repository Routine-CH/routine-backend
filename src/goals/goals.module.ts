import { Module } from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { SharedModule } from 'src/utils/modules/shared-module';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

@Module({
  imports: [SharedModule],
  controllers: [GoalsController],
  providers: [GoalsService, PrismaService, S3Service, GamificationInterceptor],
})
export class GoalsModule {}
