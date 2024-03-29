import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { jwtRefreshTokenSecret, jwtSecret } from 'src/utils/constants';
import { ApiResponseMessages } from 'src/utils/return-types.ts/response-messages';
import { CustomRequest, UserPayload } from 'src/utils/types';
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
  async refreshToken(req: CustomRequest) {
    const refreshToken = req.headers['x-refresh-token'] as string;

    const verifyRefreshToken = this.jwt.verify(refreshToken, {
      secret: jwtRefreshTokenSecret,
    });

    // check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (verifyRefreshToken.exp && verifyRefreshToken.exp <= now) {
      throw new UnauthorizedException(
        ApiResponseMessages.error.bad_request_400.INVALID_REFRESH_TOKEN,
      );
    }

    // generate new tokens
    const payload = {
      id: verifyRefreshToken.id,
      username: verifyRefreshToken.username,
    };
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
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.USERNAME_TAKEN,
      );
    }

    // check if email already exists
    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: { email },
    });
    if (emailAlreadyExists) {
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.EMAIL_TAKEN,
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
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
      );
    }
    return { message: ApiResponseMessages.success.ok_200.SIGNUP };
  }

  // login logic
  async login(dto: LoginUserDto) {
    const { username, password } = dto;

    // check if user already exists
    const userExists = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!userExists) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.USER);
    }

    // compare password
    const isMatch = await this.comparePassword(password, userExists.password);
    if (!isMatch) {
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.PASSWORDS_DO_NOT_MATCH,
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
        throw new UnauthorizedException(
          ApiResponseMessages.error.not_found_404.TOKEN,
        );
      }

      return { message: ApiResponseMessages.success.ok_200.LOGIN, ...tokens };
    }
    return null;
  }

  // logout logic
  async logout(res: Response) {
    res.clearCookie('token');
    return {
      statusCode: HttpStatus.OK,
      message: ApiResponseMessages.success.ok_200.LOGOUT,
    };
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
