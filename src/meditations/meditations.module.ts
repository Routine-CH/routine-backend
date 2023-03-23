import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MeditationsController } from './meditations.controller';
import { MeditationsService } from './meditations.service';

@Module({
  controllers: [MeditationsController],
  providers: [MeditationsService, PrismaService],
})
export class MeditationsModule {}
