import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { SharedModule } from 'src/utils/modules/shared-module';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';

@Module({
  imports: [SharedModule],
  controllers: [BadgesController],
  providers: [BadgesService, PrismaService, S3Service],
})
export class BadgesModule {}
