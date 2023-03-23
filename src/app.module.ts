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
import { GoalsController } from './goals/goals.controller';
import { GoalsModule } from './goals/goals.module';
import { JournalsController } from './journals/journals.controller';
import { JournalsModule } from './journals/journals.module';
import { TrackLoginMiddleware } from './middlewares/track-login.middleware';
import { PomodoroTimersController } from './pomodoro-timers/pomodoro-timers.controller';
import { PomodoroTimersModule } from './pomodoro-timers/pomodoro-timers.module';
import { PomodoroTimersService } from './pomodoro-timers/pomodoro-timers.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { S3Service } from './s3/s3.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    JournalsModule,
    GoalsModule,
    TasksModule,
    PomodoroTimersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PomodoroTimersModule,
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
      .apply(TrackLoginMiddleware)
      .exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/register', method: RequestMethod.POST },
      )
      .forRoutes(
        GoalsController,
        JournalsController,
        TasksController,
        {
          path: 'users/me',
          method: RequestMethod.GET,
        },
        {
          path: 'users/:id',
          method: RequestMethod.ALL,
        },
        {
          path: 'users',
          method: RequestMethod.GET,
        },
      );
  }
}
