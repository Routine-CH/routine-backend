import { ApiProperty } from '@nestjs/swagger';

// User API response
export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  badges: [userId: string, badgeId: string];
}

// JWT API response
export class UserJwtPayload {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

// Multiple goals API response
export class Goals {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;
}

// Goal API response
export class Goal {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  importance: string;

  @ApiProperty()
  vision: string;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  createdAt: Date;
}

// Multitple journals API response
export class Journals {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;
}

// Journal API response
export class Journal {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  mood: string;

  @ApiProperty()
  moodDescription: string;

  @ApiProperty()
  activity: string;

  @ApiProperty()
  toImprove: string;

  @ApiProperty()
  createdAt: Date;
}

// Meditation API response
export class Meditation {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  totalDuration: number;
}

// Pomodoro-Timer API response
export class PomodoroTimer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  totalDuration: number;
}
