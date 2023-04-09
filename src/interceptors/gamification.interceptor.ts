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
        const earnedBadge = await getEarnedBadge.call(this, path, userId);

        // assign the earnedBadge to the request object
        request.user.earnedBadge = earnedBadge;

        // award experience points to the user
        let xp = 0;

        // check path and assign xp
        switch (true) {
          case path.startsWith('/auth-check'):
            if (method === 'GET') {
              xp = 10;
            }
            break;
          case path.startsWith('/journals'):
            if (method === 'POST') {
              xp = 10;
            }
            break;
          case path.startsWith('/goals/') || path.startsWith('/todos/'):
            if (method === 'PUT' && request.body.completed === true) {
              xp = 10;
            }
            break;
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

  // async getRecordCount of table
  async getRecordCount(
    userId: string,
    tableName: 'goals' | 'todos' | 'journals',
  ): Promise<number> {
    try {
      let count;

      switch (tableName) {
        case 'goals':
          count = await this.prisma.goal.count({
            where: { userId: userId, completed: true },
          });
          break;
        case 'todos':
          count = await this.prisma.todo.count({
            where: { userId: userId, completed: true },
          });
          break;
        case 'journals':
          count = await this.prisma.journal.count({
            where: { userId: userId },
          });
          break;
        default:
          console.error(`Error: Table '${tableName}' not found.`);
          return 0;
      }

      if (typeof count === 'undefined') {
        console.error(`Error: Count is undefined for table '${tableName}'.`);
        return 0;
      }

      return count;
    } catch (error) {
      console.error(
        `Error in getRecordCount for table '${tableName}': `,
        error,
      );
      return 0;
    }
  }

  // async getTotalDuration of table
  async getTotalDuration(
    userId: string,
    tableName: 'meditations' | 'pomodoro-timers',
  ): Promise<number> {
    try {
      let durations;

      switch (tableName) {
        case 'meditations':
          durations = await this.prisma.meditations.findFirst({
            where: { userId: userId },
            select: { totalDuration: true },
          });
          break;
        case 'pomodoro-timers':
          durations = await this.prisma.pomodoroTimers.findFirst({
            where: { userId: userId },
            select: { totalDuration: true },
          });
          break;
        default:
          console.error(`Error: Table '${tableName}' not found.`);
          return 0;
      }

      // return total duration
      return (
        durations.reduce(
          (accumulator: number, current: { totalDuration: number }) =>
            accumulator + current.totalDuration,
          0,
        ) ?? 0
      );
    } catch (error) {
      console.error(
        `Error in getTotalDuration for table '${tableName}': `,
        error,
      );
      return 0;
    }
  }

  // check loginstreaks
  async checkLoginStreaks(userId: string) {
    const userStreaks = await this.prisma.userStreaks.findFirst({
      where: { userId: userId },
    });

    // assign badges based on the login streaks or login count
    if (userStreaks.streakCount <= 35) {
      const loginStreaks = [7, 14, 21, 28, 35];
      const foundStreak = loginStreaks.find(
        (streak) => userStreaks.streakCount >= streak,
      );
      if (foundStreak) {
        await this.assignBadge(userId, foundStreak);
      }
    } else if (userStreaks.loginCount <= 100) {
      const loginCounts = [10, 25, 50, 75, 100];
      const foundCount = loginCounts.find(
        (count) => userStreaks.loginCount >= count,
      );
      if (foundCount) {
        await this.assignBadge(userId, foundCount);
      }
    }
  }

  // asign badge function
  async assignBadge(
    userId: string,
    countOrDuration: number,
  ): Promise<BadgeInfo | null> {
    // get all badges that meet the count or the duration
    const eligibleBadges = await this.prisma.badge.findMany({
      where: {
        requiredCountOrDuration: countOrDuration,
      },
    });

    // if no eligibla badges are found
    if (eligibleBadges.length === 0) {
      return null;
    }

    // find a badge that the user has not earned yet
    let unassignedBadge = null;
    for (const badge of eligibleBadges) {
      const userBadge = await this.prisma.userBadges.findFirst({
        where: {
          userId: userId,
          badgeId: badge.id,
        },
      });
      if (!userBadge) {
        unassignedBadge = badge;
        break;
      }
    }

    // assign badge to user if an unassigned badge is found
    if (unassignedBadge) {
      await this.prisma.userBadges.create({
        data: {
          userId: userId,
          badgeId: unassignedBadge.id,
        },
      });

      return {
        title: unassignedBadge.title,
        description: unassignedBadge.description,
        imageUrl: unassignedBadge.image,
      };
    }

    // if user badge is found, return null
    return null;
  }
}
