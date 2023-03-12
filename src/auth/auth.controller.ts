import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
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

  // logout route
  @Get('logout')
  logout(@Req() req, @Res() res) {
    return this.authService.logout(req, res);
  }
}
