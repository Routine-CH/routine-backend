import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from 'src/utils/constants';
import { UserPayload } from 'src/utils/types';
import { jwtRefreshTokenSecret } from './../utils/constants';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: Partial<LoginUserDto>) {
    return await this.authService.validateUser(payload);
  }
}

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtRefreshTokenSecret,
    });
  }

  async validate(payload: Partial<UserPayload>) {
    return await this.authService.validateRefreshToken(payload);
  }
}
