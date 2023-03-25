import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { differenceInCalendarDays } from 'date-fns';
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
export class AuthTrackMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // get token from request
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // if token is valid
    try {
      // if  user is authenticated, extract userId from token
      const userId = getUserIdFromToken(token, this.jwtService);
      if (userId) {
        const currentDate = new Date();

        // check existing record
        const userStreak = await this.prisma.userStreaks.findFirst({
          where: {
            userId: userId,
          },
        });

        // if there is an existing record, update it
        if (userStreak) {
          const daysDifference = differenceInCalendarDays(
            currentDate,
            userStreak.lastLoginDate,
          );
          let streakCount = userStreak.streakCount;
          let loginCount = userStreak.loginCount;

          // check days difference, update streak if difference is 1
          if (daysDifference === 1) {
            streakCount++;
          } else if (daysDifference > 1) {
            streakCount = 1;
          }

          // update loginCount if days difference is not 0
          if (daysDifference !== 0) {
            loginCount += 1;
          }

          // update record
          await this.prisma.userStreaks.update({
            where: {
              id: userStreak.id,
            },
            data: {
              lastLoginDate: currentDate,
              streakCount: streakCount,
              loginCount: loginCount,
            },
          });
        } else {
          // if there is no existing record, create a new one
          await this.prisma.userStreaks.create({
            data: {
              userId: userId,
              lastLoginDate: currentDate,
              streakCount: 1,
              loginCount: 1,
            },
          });
        }
      }
      next();
    } catch (error) {
      res.redirect('/auth/refresh-token');
    }
  }
}
