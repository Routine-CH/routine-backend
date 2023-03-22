import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

// get userId from token function
function getUserIdFromToken(
  token: string,
  jwtService: JwtService,
): string | null {
  try {
    const decodedToken = jwtService.verify(token);
    return decodedToken.id;
  } catch (error) {
    console.error('Error verifying token: ', error);
    return null;
  }
}

@Injectable()
export class TrackLoginMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // get token from request
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // if  user is authenticated, extract userId from token
    const userId = getUserIdFromToken(token, this.jwtService);

    // if userId is available, chec if a record exists for the current day
    if (userId) {
      const currentDate = new Date();
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      const endOfday = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
      );

      // check existing record
      const existingLogin = await this.prisma.userLogins.findFirst({
        where: {
          userId: userId,
          loginDate: {
            gte: startOfDay,
            lt: endOfday,
          },
        },
      });

      // if there is no existing record for the current day, create a new one
      if (!existingLogin) {
        await this.prisma.userLogins.create({
          data: {
            userId: userId,
            loginDate: currentDate,
          },
        });
      }
    }
    // continue processing request
    next();
  }
}
