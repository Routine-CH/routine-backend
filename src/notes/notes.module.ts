import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { SharedModule } from 'src/utils/modules/shared-module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [SharedModule],
  controllers: [NotesController],
  providers: [NotesService, PrismaService, S3Service],
})
export class NotesModule {}
