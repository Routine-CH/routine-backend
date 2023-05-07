import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
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
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Refresh token is invalid',
        },
        HttpStatus.UNAUTHORIZED,
      );
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

    // check if user already exists
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { username },
    });
    if (userAlreadyExists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Username already taken. Please try another username.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // check if email already exists
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email },
    });
    if (emailAlreadyExists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'E-Mail already exists. Please try another E-Mail.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // save hashed password from the current password
    const hashedPassword = await this.hashPassword(password);

    // create user with prisma
    const userCreated = await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    if (userCreated) {
      await this.prisma.notificationSettings.create({
        data: {
          userId: userCreated.id,
          goalsEmailNotification: false,
          goalsPushNotification: false,
          todosEmailNotification: false,
          todosPushNotification: false,
          journalsEmailNotification: false,
          journalsPushNotification: false,
          muteAllNotifications: true,
          muteGamification: false,
        },
      });
    } else {
      return new BadRequestException('Something went wrong. Please try again.');
    }

    return { statusCode: HttpStatus.CREATED, message: 'Signup was successful' };
  }

  // login logic
  async login(dto: LoginUserDto) {
    const { username, password } = dto;

    // check if user already exists
    const userExists = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!userExists) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message:
            'User doesn’t exist. Please check your username and try again.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // compare password
    const isMatch = await this.comparePassword(password, userExists.password);
    if (!isMatch) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `The password you entered is incorrect. Please try again.`,
        },
        HttpStatus.BAD_REQUEST,
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
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: `Token not found. Please try again.`,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Login succesful',
        data: { ...tokens },
      };
    }
    return null;
  }

  // logout logic
  async logout(res: Response) {
    res.clearCookie('token');
    return res.send({ statusCode: HttpStatus.OK, message: 'Logout succesful' });
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
