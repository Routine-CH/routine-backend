import { UserBadges } from '@prisma/client';
import { Request } from 'express';

export type User = {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  badges: UserBadges[];
};

export interface CustomRequest extends Request {
  user: User;
}

export type UserPayload = {
  id: string;
  username: string;
  email: string;
};
