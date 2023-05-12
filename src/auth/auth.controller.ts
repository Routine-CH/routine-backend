import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { createResponse } from 'src/utils/helper/functions';
import { ApiResponseMessages } from 'src/utils/return-types.ts/response-messages';
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
  async signup(@Body() dto: CreateUserDto) {
    const result = await this.authService.signUp(dto);
    return createResponse(HttpStatus.CREATED, result.message);
  }

  // login route
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const result = await this.authService.login(dto);
    return createResponse(HttpStatus.OK, result.message, {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    });
  }

  // auth check route
  @Get('auth-check')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async authCheck(@Req() req: CustomRequest) {
    const earnedBadge = req.user.earnedBadge;
    const experience = req.user.experience;
    const responseData = { earnedBadge, experience };
    return createResponse(
      HttpStatus.OK,
      ApiResponseMessages.success.ok_200.AUTHCHECK,
      responseData,
    );
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
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    const result = await this.authService.logout(res);
    res
      .status(result.statusCode)
      .json(createResponse(result.statusCode, result.message));
    // return createResponse(result);
  }
}
