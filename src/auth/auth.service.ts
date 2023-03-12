import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { jwtSecret } from 'src/utils/constants';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

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
  async login(dto: LoginUserDto, req: Request, res: Response) {
    const { username, password } = dto;

    // check if user already exists
    const userExists = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!userExists) {
      throw new BadRequestException(
        `We couldn’t find an account matching the username you entered. Please check your username and try again.`,
      );
    }

    // compare password
    const isMatch = await this.comparePassword(password, userExists.password);

    if (!isMatch) {
      throw new BadRequestException(
        `We couldn’t find an account matching the username and password you entered. Please check your username and password and try again.`,
      );
    }

    if (userExists && isMatch) {
      // sign jwt token and return to the user
      const token = await this.signToken({
        id: userExists.id,
        username: userExists.username,
      });

      // if no token found
      if (!token) {
        throw new ForbiddenException();
      }

      return res.send({ message: 'login succesful', token: token });
    }
    return null;
  }

  // logout logic
  async logout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'logout succesful' });
  }

  // hash password function
  async hashPassword(password: string) {
    const saltrounds = 10;
    return await bcrypt.hash(password, saltrounds);
  }

  // helper function to compare password
  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // helper function to sign jwt token
  async signToken(args: { id: string; username: string }) {
    const payload = args;
    return this.jwt.sign(payload, { secret: jwtSecret, expiresIn: '1d' });
  }
}
