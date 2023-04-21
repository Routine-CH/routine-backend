import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { differenceInCalendarDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtSecret } from '../constants';
import { BadgeInfo } from '../return-types.ts/types';
import { CustomRequest } from '../types';

export function getUserIdFromToken(
  token: string,
  jwtService: JwtService,
): string | null {
  try {
    const decodedToken = jwtService.verify(token, { secret: jwtSecret });
    return decodedToken.id;
  } catch (error) {
    console.error('Error verifying token: ', error);
    return null;
  }
}

export async function getEarnedBadge(
  userId: string,
  path: string,
  request: CustomRequest,
  prisma: PrismaService,
) {
  if (
    path.startsWith('/goals') ||
    path.startsWith('/todos') ||
    path.startsWith('/journals')
  ) {
    const tableName = path.startsWith('/goals')
      ? 'goals'
      : path.startsWith('/todos')
      ? 'todos'
      : 'journals';

    const count: number = await getRecordCount(userId, tableName, prisma);

    // increment count by 1 to check if user has earned a badge
    const incrementedCount = count + 1;

    if ([10, 25, 50, 75, 100].includes(incrementedCount)) {
      return await assignBadge.call(this, userId, incrementedCount, tableName);
    }
  } else if (
    path.startsWith('/meditations') ||
    path.startsWith('/pomodoro-timers')
  ) {
    const tableName = path.startsWith('/meditations')
      ? 'meditations'
      : 'pomodoro-timers';

    // get currentDuration from request body
    const currentDuration = request.body.durationInSeconds;

    // get TotalDuration from database
    const totalDuration = await getTotalDuration(userId, tableName, prisma);

    // increment totalduration by currentDuration to check if user has earned a badge
    const incrementedTotalDuration = totalDuration + currentDuration;

    if ([1800, 3600, 7200, 10800, 14400].includes(incrementedTotalDuration)) {
      return await assignBadge.call(
        this,
        userId,
        incrementedTotalDuration,
        tableName,
      );
    }
  } else if (path.startsWith('/auth/auth-check')) {
    await updateStreak(userId, prisma);
    const badge = await checkLoginStreaks(userId, prisma);
    if (badge) {
      return badge;
    }
  }

  return null;
}

// async getRecordCount of table
async function getRecordCount(
  userId: string,
  tableName: 'goals' | 'todos' | 'journals',
  prisma: PrismaService,
): Promise<number> {
  try {
    let count;

    switch (tableName) {
      case 'goals':
        count = await prisma.goal.count({
          where: { userId: userId, completed: true },
        });
        break;
      case 'todos':
        count = await prisma.todo.count({
          where: { userId: userId, completed: true },
        });
        break;
      case 'journals':
        count = await prisma.journal.count({
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
    console.error(`Error in getRecordCount for table '${tableName}': `, error);
    return 0;
  }
}

// async getTotalDuration of table
async function getTotalDuration(
  userId: string,
  tableName: 'meditations' | 'pomodoro-timers',
  prisma: PrismaService,
): Promise<number> {
  try {
    let durations;

    switch (tableName) {
      case 'meditations':
        durations = await prisma.meditations.findMany({
          where: { userId: userId },
          select: { totalDuration: true },
        });
        break;
      case 'pomodoro-timers':
        durations = await prisma.pomodoroTimers.findMany({
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

export async function updateStreak(userId: string, prisma: PrismaService) {
  const currentDate = new Date();

  // check existing record
  const userStreak = await prisma.userStreaks.findFirst({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      streakCount: true,
      loginCount: true,
      lastLoginDate: true,
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
    await prisma.userStreaks.update({
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
    await prisma.userStreaks.create({
      data: {
        userId: userId,
        lastLoginDate: currentDate,
        streakCount: 1,
        loginCount: 1,
      },
    });
  }
}

// check loginstreaks
async function checkLoginStreaks(userId: string, prisma: PrismaService) {
  const userStreaks = await prisma.userStreaks.findFirst({
    where: { userId: userId },
  });

  if (!userStreaks) {
    return null;
  }

  const loginStreakThresholds = [7, 14, 21, 28, 35];
  const loginCountThresholds = [10, 25, 50, 75, 100];

  // assign badges based on the login streaks or login count
  if (loginStreakThresholds.includes(userStreaks.streakCount)) {
    return await assignBadge.call(
      this,
      userId,
      userStreaks.streakCount,
      'login-streak',
      prisma,
    );
  } else if (loginCountThresholds.includes(userStreaks.loginCount)) {
    return await assignBadge.call(
      this,
      userId,
      userStreaks.loginCount,
      'login-count',
      prisma,
    );
  }

  return null;
}

// asign badge function
async function assignBadge(
  userId: string,
  countOrDuration: number,
  activityType: string,
  prisma?: PrismaService,
): Promise<BadgeInfo | null> {
  // use the passed in prisma instance or the default one
  const db = prisma ?? this.prisma;

  // get all badges that meet the count or the duration
  const eligibleBadges = await db.badge.findMany({
    where: {
      requiredCountOrDuration: countOrDuration,
      activityType: activityType,
    },
  });

  // if no eligibla badges are found
  if (eligibleBadges.length === 0) {
    return null;
  }

  // find a badge that the user has not earned yet
  let unassignedBadge = null;
  for (const badge of eligibleBadges) {
    const userBadge = await db.userBadges.findFirst({
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
    await db.userBadges.create({
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

export async function awardExperiencePoints(
  userId: string,
  xp: number,
): Promise<void | BadRequestException> {
  // check if user exists
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (user) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { experience: { increment: xp } },
    });
  } else {
    return new BadRequestException('User not found');
  }
}
