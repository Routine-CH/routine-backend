import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/utils/constants';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';

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
  login(@Body() dto: LoginUserDto, @Req() req, @Res() res) {
    return this.authService.login(dto, req, res);
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }

  // logout route
  @Get('logout')
  logout(@Req() req, @Res() res) {
    return this.authService.logout(req, res);
  }
}
