import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { GoalsModule } from './goals/goals.module';
import { JournalsModule } from './journals/journals.module';
import { MeditationsModule } from './meditations/meditations.module';
import { AuthTrackMiddleware } from './middlewares/auth-track.middleware';
import { GamificationMiddleware } from './middlewares/gamification.middleware';
import { PomodoroTimersController } from './pomodoro-timers/pomodoro-timers.controller';
import { PomodoroTimersModule } from './pomodoro-timers/pomodoro-timers.module';
import { PomodoroTimersService } from './pomodoro-timers/pomodoro-timers.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { S3Service } from './s3/s3.service';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';

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
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PomodoroTimersModule,
    MeditationsModule,
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
      .exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/register', method: RequestMethod.POST },
      )
      .forRoutes({ path: 'auth/auth-check', method: RequestMethod.GET });

    consumer
      .apply(GamificationMiddleware)
      .forRoutes(
        { path: 'goals', method: RequestMethod.ALL },
        { path: 'todos', method: RequestMethod.ALL },
        { path: 'journals', method: RequestMethod.ALL },
        { path: 'meditations', method: RequestMethod.ALL },
        { path: 'pomodoro-timers', method: RequestMethod.ALL },
        { path: 'auth/auth-check', method: RequestMethod.ALL },
      );
  }
}
