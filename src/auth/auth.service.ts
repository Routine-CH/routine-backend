import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // signup logic
  async signUp(dto: CreateUserDto) {
    const { username, email, password } = dto;

    // check if email already exists
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (emailAlreadyExists) {
      throw new BadRequestException('Email already exists');
    }

    // check if user already exists
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (userAlreadyExists) {
      throw new BadRequestException('Username is already taken');
    }

    // save hashed password from the current password
    const hashedPassword = await this.hashPassword(password);

    // create user with prisma
    await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return { message: 'signup was successful' };
  }

  // login logic
  async login(dto: LoginUserDto) {
    const { username, password } = dto;
    return { message: 'welcome back!' };
  }

  // logout logic
  async logout() {
    return { message: 'see you soon' };
  }

  // hash password function
  async hashPassword(password: string) {
    const saltrounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltrounds);
    return hashedPassword;
  }
}
