import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { Public } from 'src/utils/constants';
import { CustomRequest } from 'src/utils/types';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { JwtRefreshTokenAuthGuard } from './jwt-refresh-token.guard';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // signup route
  @Public()
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  // login route
  @Public()
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  // auth check route
  @Get('auth-check')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async authCheck() {
    return { message: 'Authenticated and login tracked' };
  }

  // Refresh token route
  @Get('refresh-token')
  @UseGuards(JwtRefreshTokenAuthGuard)
  async refreshToken(@Req() req: CustomRequest) {
    const tokens = await this.authService.refreshToken(req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens succesfully refreshed',
      data: { ...tokens },
    };
  }

  // logout route
  @Get('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
