import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService, PrismaService, GamificationInterceptor],
})
export class TodosModule {}
