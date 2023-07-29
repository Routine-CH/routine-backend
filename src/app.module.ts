import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { CalendarModule } from './calendar/calendar.module';
import { GoalsModule } from './goals/goals.module';
import { JournalsModule } from './journals/journals.module';
import { MeditationsModule } from './meditations/meditations.module';
import { AuthTrackMiddleware } from './middlewares/auth-track.middleware';
import { NotesModule } from './notes/notes.module';
import { PomodoroTimersController } from './pomodoro-timers/pomodoro-timers.controller';
import { PomodoroTimersModule } from './pomodoro-timers/pomodoro-timers.module';
import { PomodoroTimersService } from './pomodoro-timers/pomodoro-timers.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { S3Service } from './s3/s3.service';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './utils/modules/shared-module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    JournalsModule,
    GoalsModule,
    TodosModule,
    PomodoroTimersModule,
    MeditationsModule,
    SharedModule,
    NotesModule,
    CalendarModule,
  ],
  controllers: [AppController, PomodoroTimersController],
  providers: [
    AppService,
    PrismaService,
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
    S3Service,
    PomodoroTimersService,
  ],
})
export class AppModule implements NestModule {
  // implement middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTrackMiddleware)
      .forRoutes({ path: 'users/me', method: RequestMethod.GET });
  }
}
