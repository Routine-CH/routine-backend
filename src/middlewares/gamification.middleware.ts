import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadgeInfo } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';

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

// get badge according to the routher path
async function getEarnedBadge(path: string, userId: string) {
  if (
    path.startsWith('/goals') ||
    path.startsWith('/tasks') ||
    path.startsWith('/journals')
  ) {
    const tableName = path.startsWith('/goals')
      ? 'goals'
      : path.startsWith('/tasks')
      ? 'tasks'
      : 'journals';

    const count: number = await this.getRecordCount(userId, tableName);
    if ([10, 25, 50, 75, 100].includes(count)) {
      return await this.assignBadge(userId, tableName, count);
    }
  } else if (
    path.startsWith('/meditations') ||
    path.startsWith('/pomodoro-timers')
  ) {
    const tableName = path.startsWith('/meditations')
      ? 'meditations'
      : 'pomodoro-timers';

    const totalDuration = await this.getTotalDuration(userId, tableName);
    if ([1800, 3600, 7200, 10800, 14400].includes(totalDuration)) {
      return await this.assignBadge(userId, tableName, totalDuration);
    }
  }

  return null;
}

@Injectable()
export class GamificationMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    // initialize earnedBadge
    let earnedBadge: BadgeInfo | null = null;

    // get token from request
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    //if token is valid
    try {
      // if user is authenticated, extract userId from token
      const userId = getUserIdFromToken(token, this.jwtService);
      if (userId) {
        // get path from request
        const path = req.path;

        // Call getEarnedBadge function to get the earned badge
        earnedBadge = await getEarnedBadge.call(this, path, userId);
      }

      // Call next with the earnedBadge as an argument
      res.locals.earnedBadge = earnedBadge;
      next();
    } catch (error) {
      console.log(error);
    }
  }

  // async getRecordCount of table
  async getRecordCount(
    userId: string,
    tableName: 'goals' | 'tasks' | 'journals',
  ): Promise<number> {
    try {
      let count;

      switch (tableName) {
        case 'goals':
          count = await this.prisma.goal.count({
            where: { userId: userId },
          });
          break;
        case 'tasks':
          count = await this.prisma.task.count({
            where: { userId: userId },
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
