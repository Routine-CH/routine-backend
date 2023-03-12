import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';

@Module({
  controllers: [JournalsController],
  providers: [JournalsService, PrismaService],
})
export class JournalsModule {}
