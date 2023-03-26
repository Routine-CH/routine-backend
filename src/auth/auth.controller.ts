import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/utils/constants';
import { UserJwtPayload } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { JwtRefreshTokenAuthGuard } from './jwt-refresh-token.guard';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // signup route
  @ApiCreatedResponse({ description: 'Signup was successful' })
  @ApiBadRequestResponse({
    status: 400,
    schema: {
      anyOf: [
        {
          title: 'E-Mail already exists',
          example: 'E-Mail already exists. Please try another E-Mail.',
          description: 'E-Mail already exists. Please try another E-Mail.',
        },
        {
          title: 'Username already taken',
          example: 'Username already taken. Please try another username.',
          description: 'Username already taken. Please try another username.',
        },
      ],
    },
  })
  @Public()
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  // login route
  @ApiCreatedResponse({ description: 'Login successful', type: UserJwtPayload })
  @ApiNotFoundResponse({
    description:
      'User doesn’t exist. Please check your username and try again.',
  })
  @ApiBadRequestResponse({
    description: 'The password you entered is incorrect. Please try again.',
  })
  @ApiUnauthorizedResponse({
    description: 'No token found, sorry, you are not authorized',
  })
  @Public()
  @Post('login')
  login(@Body() dto: LoginUserDto, @Res() res: Response) {
    return this.authService.login(dto, res);
  }

  // auth check route
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({ description: 'Authenticated and login tracked' })
  @Get('auth-check')
  @UseGuards(JwtAuthGuard)
  async authCheck() {
    return { message: 'Authenticated and login tracked' };
  }

  // Refresh token route
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Refresh token is valid',
    type: UserJwtPayload,
  })
  @ApiUnauthorizedResponse({ description: 'Refresh token is invalid' })
  @Get('refresh-token')
  @UseGuards(JwtRefreshTokenAuthGuard)
  async refreshToken(@Req() req: CustomRequest, @Res() res: Response) {
    const tokens = await this.authService.refreshToken(req.user);
    res.send({ message: 'Refresh token is valid', ...tokens });
  }

  // logout route
  @ApiCreatedResponse({ description: 'Logout successful' })
  @Get('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
