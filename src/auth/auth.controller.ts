import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
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
  login(@Body() dto: LoginUserDto, @Res() res: Response) {
    return this.authService.login(dto, res);
  }

  // auth check route
  @Get('auth-check')
  @UseGuards(JwtAuthGuard)
  async authCheck() {
    return { message: 'Authenticated and login tracked' };
  }

  // Refresh token route
  @Get('refresh-token')
  @UseGuards(JwtRefreshTokenAuthGuard)
  async refreshToken(@Req() req: CustomRequest, @Res() res: Response) {
    const tokens = await this.authService.refreshToken(req.user);
    res.send({ message: 'Refresh token is valid', ...tokens });
  }

  // logout route
  @Get('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
