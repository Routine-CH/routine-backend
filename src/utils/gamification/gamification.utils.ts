import { JwtService } from '@nestjs/jwt';
import { differenceInCalendarDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtSecret } from '../constants';
import { BadgeInfo } from '../return-types.ts/types';

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
  path: string,
  userId: string,
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

    const totalDuration = await getTotalDuration(userId, tableName, prisma);
    if ([1800, 3600, 7200, 10800, 14400].includes(totalDuration)) {
      return await assignBadge(userId, totalDuration);
    }
  }

  return null;
}

// async getRecordCount of table
export async function getRecordCount(
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
export async function getTotalDuration(
  userId: string,
  tableName: 'meditations' | 'pomodoro-timers',
  prisma: PrismaService,
): Promise<number> {
  try {
    let durations;

    switch (tableName) {
      case 'meditations':
        durations = await prisma.meditations.findFirst({
          where: { userId: userId },
          select: { totalDuration: true },
        });
        break;
      case 'pomodoro-timers':
        durations = await prisma.pomodoroTimers.findFirst({
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
export async function checkLoginStreaks(userId: string) {
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
export async function assignBadge(
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

export async function awardExperiencePoints(
  userId: string,
  xp: number,
): Promise<void> {
  await this.prisma.user.update({
    where: { id: userId },
    data: { experience: { increment: xp } },
  });
}

export async function updateStreak(userId: string, prisma: PrismaService) {
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
