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

// Badge API response
export interface BadgeInfo {
  title: string;
  description: string;
  imageUrl: string;
}
