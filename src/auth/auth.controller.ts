import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // signup route
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  // login route
  @Post('login')
  login() {
    return this.authService.login();
  }

  // logout route
  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
