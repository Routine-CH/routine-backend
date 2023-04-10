// gamification.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  awardExperiencePoints,
  getEarnedBadge,
  getUserIdFromToken,
} from 'src/utils/gamification/gamification.utils';
import { BadgeInfo } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';

@Injectable()
export class GamificationInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<CustomRequest>();

    // get method and path from request
    const method = request.method;
    const path = request.path;

    // check if current route and method match
    const shouldApplyLogic = [
      { path: '/goals/:id', method: 'PUT' },
      { path: '/todos/:id', method: 'PATCH' },
      { path: '/journals', method: 'POST' },
      { path: '/meditations', method: 'POST' },
      { path: '/pomodoro-timers', method: 'POST' },
      { path: '/auth/auth-check', method: 'GET' },
    ].some(
      (route) =>
        path.startsWith(route.path.split(':')[0]) && method === route.method,
    );

    if (!shouldApplyLogic) {
      return next.handle();
    }

    // get token from request
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // if token is valid
    try {
      // if user is authenticated, extract userId from token
      const userId = getUserIdFromToken(token, this.jwtService);
      if (userId) {
        // get path from request

        // call getEarnedBadge function to get the earned badge
        const earnedBadge = await getEarnedBadge.call(
          this,
          path,
          userId,
          this.prisma,
        );

        // assign the earnedBadge to the request object
        request.user.earnedBadge = earnedBadge;

        // award experience points to the user
        let xp = 0;

        // check path and assign xp
        switch (true) {
          case path.startsWith('/journals'):
            if (method === 'POST') {
              xp = 10;
            }
            break;
          case path.startsWith('/goals'):
            const isCompleted = Boolean(request.body.completed);
            if (method === 'PUT' && isCompleted === true) {
              xp = 10;
            }
            break;
          case path.startsWith('/todos'):
            if (method === 'PATCH' && request.body.completed === true) {
              xp = 10;
            }
          case path.startsWith('/pomodoro-timers'):
            if (method === 'POST' && request.body.durationInSeconds >= 1800) {
              xp = 10;
            }
            break;
          case path.startsWith('/meditations'):
            if (method === 'POST' && request.body.durationInSeconds >= 1800) {
              xp = 10;
            }
            break;
        }

        const experiencePoints = await awardExperiencePoints.call(
          this,
          userId,
          xp,
        );
        request.user.experience = experiencePoints;
      }
    } catch (error) {
      console.log(error);
    }

    return next.handle().pipe(
      map((data) => {
        if (shouldApplyLogic) {
          const earnedBadge: BadgeInfo | null =
            request.user.earnedBadge || null;
          // if an earnedBadge is found
          if (earnedBadge) {
            return {
              ...data,
              earnedBadge,
            };
          } else {
            return data;
          }
        } else {
          return data;
        }
      }),
    );
  }
}
