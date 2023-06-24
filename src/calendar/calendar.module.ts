import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { GoalsService } from 'src/goals/goals.service';
import { JournalsService } from 'src/journals/journals.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { TodosService } from 'src/todos/todos.service';
import { SharedModule } from 'src/utils/modules/shared-module';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [
    SharedModule,
    CacheModule.register({
      ttl: 60,
      max: 20,
    }),
  ],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    PrismaService,
    GoalsService,
    TodosService,
    JournalsService,
    S3Service,
  ],
})
export class CalendarModule {}
