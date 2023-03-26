import { ApiProperty } from '@nestjs/swagger';

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

export class UserJwtPayload {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

export class Goals {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;
}

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
