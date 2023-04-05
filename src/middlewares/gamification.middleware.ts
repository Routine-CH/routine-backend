import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadgeInfo } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';

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

        // path check
        if (
          path.startsWith('/goals') ||
          path.startsWith('/tasks') ||
          path.startsWith('/journals')
        ) {
          // get table name from path
          const tableName = path.startsWith('/goals')
            ? 'goals'
            : path.startsWith('/tasks')
            ? 'tasks'
            : 'journals';

          // get count of records from table
          const count: number = await this.getRecordCount(userId, tableName);
          // assign badge
          earnedBadge = await this.assignBadge(userId, tableName, count);
        } else if (
          path.startsWith('/meditations') ||
          path.startsWith('/pomodoro-timers')
        ) {
          // get table name from path
          const tableName = path.startsWith('/meditations')
            ? 'meditations'
            : 'pomodoro-timers';

          const totalDuration = await this.getTotalDuration(userId, tableName);
          // assign badge
          earnedBadge = await this.assignBadge(
            userId,
            tableName,
            totalDuration,
          );
        }
      }

      // Call next with the earnedBadge as an argument
      next(earnedBadge);
    } catch (error) {
      console.log(error);
    }
  }

  // async getRecordCount of table
  async getRecordCount(
    userId: string,
    tableName: 'goals' | 'tasks' | 'journals',
  ): Promise<number> {
    return await this.prisma[tableName].count({
      where: { userId: userId },
    });
  }

  // async getTotalDuration of table
  async getTotalDuration(
    userId: string,
    tableName: 'meditations' | 'pomodoro-timers',
  ): Promise<number> {
    const durations = await this.prisma[tableName].findMany({
      where: { userId: userId },
      select: { durationInSeconds: true },
    });

    // return total duration
    return durations.reduce(
      (accumulator: number, current: { durationInSeconds: number }) =>
        accumulator + current.durationInSeconds,
      0,
    );
  }

  // check loginstreaks
  async checkLoginStreaks(userId: string) {
    const userStreaks = await this.prisma.userStreaks.findFirst({
      where: { userId: userId },
    });

    // assign badges based on the login streaks or login count
    if (userStreaks.streakCount === 7) {
      await this.assignBadge(userId, 'login-streaks', 7);
    } else if (userStreaks.streakCount === 14) {
      await this.assignBadge(userId, 'login-streaks', 14);
    } else if (userStreaks.streakCount === 21) {
      await this.assignBadge(userId, 'login-streaks', 21);
    } else if (userStreaks.streakCount === 28) {
      await this.assignBadge(userId, 'login-streaks', 28);
    } else if (userStreaks.streakCount === 35) {
      await this.assignBadge(userId, 'login-streaks', 35);
    } else if (userStreaks.loginCount === 10) {
      await this.assignBadge(userId, 'login-count', 10);
    } else if (userStreaks.loginCount === 25) {
      await this.assignBadge(userId, 'login-count', 25);
    } else if (userStreaks.loginCount === 50) {
      await this.assignBadge(userId, 'login-count', 50);
    } else if (userStreaks.loginCount === 75) {
      await this.assignBadge(userId, 'login-count', 75);
    } else if (userStreaks.loginCount === 100) {
      await this.assignBadge(userId, 'login-count', 100);
    }
  }

  // asign badge function
  async assignBadge(
    userId: string,
    tableName:
      | 'goals'
      | 'tasks'
      | 'journals'
      | 'meditations'
      | 'pomodoro-timers'
      | 'login-streaks'
      | 'login-count',
    countOrDuration: number,
  ): Promise<BadgeInfo | null> {
    let badgeTitle: string | null = null;

    switch (tableName) {
      case 'goals':
      case 'tasks':
      case 'journals': {
        if (countOrDuration === 10) {
          badgeTitle =
            tableName === 'goals'
              ? 'Goal Getter'
              : tableName === 'tasks'
              ? 'Task Tackler'
              : 'Journaling Journeyman';
        } else if (countOrDuration === 25) {
          badgeTitle =
            tableName === 'goals'
              ? 'Goal Guru'
              : tableName === 'tasks'
              ? 'Task Titan'
              : 'Journaling Jedi';
        } else if (countOrDuration === 50) {
          badgeTitle =
            tableName === 'goals'
              ? 'Goal Gladiator'
              : tableName === 'tasks'
              ? 'Task Terminator'
              : 'Journaling Genius';
        } else if (countOrDuration === 75) {
          badgeTitle =
            tableName === 'goals'
              ? 'Goal Grandmaster'
              : tableName === 'tasks'
              ? 'Task Trailblazer'
              : 'Journaling Juggernaut';
        } else if (countOrDuration === 100) {
          badgeTitle =
            tableName === 'goals'
              ? 'Goal God'
              : tableName === 'tasks'
              ? 'Task Tornado'
              : 'Journaling Jumbo';
        }
        break;
      }
      case 'meditations':
      case 'pomodoro-timers': {
        if (countOrDuration === 1800) {
          badgeTitle =
            tableName === 'meditations'
              ? 'Meditation Maverick'
              : 'Pomodoro Prodigy';
        } else if (countOrDuration === 3600) {
          badgeTitle =
            tableName === 'meditations'
              ? 'Meditation Mastermind'
              : 'Pomodoro Pro';
        } else if (countOrDuration === 7200) {
          badgeTitle =
            tableName === 'meditations'
              ? 'Meditation Mentor'
              : 'Pomodoro Pioneer';
        } else if (countOrDuration === 10800) {
          badgeTitle =
            tableName === 'meditations'
              ? 'Meditation Maestro'
              : 'Pomodoro Paragon';
        } else if (countOrDuration === 14400) {
          badgeTitle =
            tableName === 'meditations'
              ? 'Meditation Mogul'
              : 'Pomodoro Phenom';
        }
        break;
      }
      case 'login-streaks': {
        if (countOrDuration === 7) {
          badgeTitle = 'Streak Starter';
        } else if (countOrDuration === 14) {
          badgeTitle = 'Fortnight Fanatic';
        } else if (countOrDuration === 21) {
          badgeTitle = 'Three-week Thriver';
        } else if (countOrDuration === 28) {
          badgeTitle = 'Month-long Master';
        } else if (countOrDuration === 35) {
          badgeTitle = 'Streak Superstar';
        }
        break;
      }
      case 'login-count': {
        if (countOrDuration === 10) {
          badgeTitle = 'Login Novice';
        } else if (countOrDuration === 25) {
          badgeTitle = 'Login Enthusiast';
        } else if (countOrDuration === 50) {
          badgeTitle = 'Login Expert';
        } else if (countOrDuration === 75) {
          badgeTitle = 'Login Master';
        } else if (countOrDuration === 100) {
          badgeTitle = 'Login Legend';
        }
        break;
      }
      default:
        break;
    }

    // check if badge is already assigned
    if (badgeTitle) {
      // find badge according to the badgeTitle
      const badge = await this.prisma.badge.findFirst({
        where: { title: badgeTitle },
      });

      // if badge is found
      if (badge) {
        // check all the user badges
        const userBadges = await this.prisma.userBadges.findUnique({
          where: {
            userId_badgeId: {
              userId: userId,
              badgeId: badge.id,
            },
          },
        });

        // if user badge is not found, assign the badge
        if (!userBadges) {
          await this.prisma.userBadges.create({
            data: {
              user: { connect: { id: userId } },
              badge: { connect: { id: badge.id } },
            },
          });

          return {
            title: badge.title,
            description: badge.description,
            imageUrl: badge.imageUrl,
          };
        }

        // if user badge is found, return null
        return null;
      }
    }
  }
}
