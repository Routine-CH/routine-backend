// User API response
export class User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  badges: [userId: string, badgeId: string];
}

// JWT API response
export class UserJwtPayload {
  access_token: string;
  refresh_token: string;
}

// Badge API response
export interface BadgeInfo {
  title: string;
  description: string;
  imageUrl: string;
}
