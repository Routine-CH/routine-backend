import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtRefreshTokenSecret, jwtSecret } from 'src/utils/constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshTokenAuthGuard } from './jwt-refresh-token.guard';
import { JwtRefreshTokenStrategy, JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    JwtModule.register({
      secret: jwtRefreshTokenSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtRefreshTokenAuthGuard,
    GamificationInterceptor,
    {
      provide: 'JWT_SERVICE',
      useFactory: () => {
        return new JwtService({
          secret: jwtSecret,
          signOptions: { expiresIn: '1d' },
        });
      },
    },
    {
      provide: 'JWT_REFRESH_SERVICE',
      useFactory: () => {
        return new JwtService({
          secret: jwtRefreshTokenSecret,
          signOptions: { expiresIn: '7d' },
        });
      },
    },
  ],
  exports: ['JWT_SERVICE', 'JWT_REFRESH_SERVICE'],
})
export class AuthModule {}
