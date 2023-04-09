import { Module } from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedModule } from 'src/utils/modules/shared-module';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [SharedModule],
  controllers: [TodosController],
  providers: [TodosService, PrismaService, GamificationInterceptor],
})
export class TodosModule {}
