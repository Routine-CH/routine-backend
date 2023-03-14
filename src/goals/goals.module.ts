import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, PrismaService],
})
export class GoalsModule {}
