import { JwtService } from '@nestjs/jwt';
import { differenceInCalendarDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtSecret } from '../constants';

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

export async function getEarnedBadge(path: string, userId: string) {
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
