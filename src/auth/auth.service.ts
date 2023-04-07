import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { jwtRefreshTokenSecret, jwtSecret } from 'src/utils/constants';
import { User, UserPayload } from 'src/utils/types';
import { PrismaService } from './../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  // validateUser
  async validateUser(
    payload: Partial<LoginUserDto>,
  ): Promise<Partial<LoginUserDto>> {
    return await this.prisma.user.findUnique({
      where: { username: payload.username },
    });
  }

  // validateRefreshToken
  async validateRefreshToken(
    payload: Partial<UserPayload>,
  ): Promise<PrismaUser> {
    return await this.prisma.user.findUnique({
      where: { id: payload.id },
    });
  }

  // refreshToken logic
  async refreshToken(user: User) {
    // check if the token is expired
    const now = Math.floor(Date.now() / 1000);
    if (user.exp && user.exp <= now) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    // generate new tokens
    const payload = { id: user.id, username: user.username };
    return {
      access_token: this.jwt.sign(payload, {
        secret: jwtSecret,
        expiresIn: '1d',
      }),
      refresh_token: this.jwt.sign(payload, {
        expiresIn: '7d',
        secret: jwtRefreshTokenSecret,
      }),
    };
  }

  // signup logic
  async signUp(dto: CreateUserDto) {
    const { username, email, password } = dto;

    // check if email already exists
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (emailAlreadyExists) {
      throw new BadRequestException(
        'E-Mail already exists. Please try another E-Mail.',
      );
    }

    // check if user already exists
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (userAlreadyExists) {
      throw new BadRequestException(
        'Username already taken. Please try another username.',
      );
    }

    // save hashed password from the current password
    const hashedPassword = await this.hashPassword(password);

    // create user with prisma
    await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return { message: 'Signup was successful' };
  }

  // login logic
  async login(dto: LoginUserDto) {
    const { username, password } = dto;

    // check if user already exists
    const userExists = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!userExists) {
      throw new BadRequestException(
        'User doesn’t exist. Please check your username and try again.',
      );
    }

    // compare password
    const isMatch = await this.comparePassword(password, userExists.password);
    if (!isMatch) {
      throw new BadRequestException(
        `The password you entered is incorrect. Please try again.`,
      );
    }

    // if user exists and password matches
    if (userExists && isMatch) {
      // sign jwt token and return to the user
      const tokens = await this.signToken({
        id: userExists.id,
        username: userExists.username,
      });

      // if no token found
      if (!tokens) {
        throw new ForbiddenException('Sorry, you are not authorized');
      }

      return { message: 'Login succesful', ...tokens };
    }
    return null;
  }

  // logout logic
  async logout(res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logout succesful' });
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
  async signToken(payload: { id: string; username: string }) {
    const accessToken = this.jwt.sign(payload, {
      secret: jwtSecret,
      expiresIn: '1d',
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '7d',
      secret: jwtRefreshTokenSecret,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
