import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // signup logic
  async signUp(dto: CreateUserDto) {
    const { username, email, password } = dto;
    return { message: 'signup was successful' };
  }

  // login logic
  async login() {
    return { message: 'welcome back!' };
  }

  // logout logic
  async logout() {
    return { message: 'see you soon' };
  }
}
