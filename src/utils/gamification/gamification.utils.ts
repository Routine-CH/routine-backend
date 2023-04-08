import { JwtService } from '@nestjs/jwt';

export function getUserIdFromToken(
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
