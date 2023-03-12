import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
