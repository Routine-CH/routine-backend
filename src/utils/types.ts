import { UserBadges } from '@prisma/client';
import { Request } from 'express';

export type User = {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  badges: UserBadges[];
  exp?: number;
};

export interface CustomRequest extends Request {
  user: User;
}

export type UserPayload = {
  id: string;
  username: string;
  email: string;
};

export type UpdateData = {
  email?: string;
  username?: string;
  password?: string;
  avatarUrl?: string;
};

export type TableNames =
  | 'goals'
  | 'todos'
  | 'journals'
  | 'meditations'
  | 'pomodoro-timers'
  | 'login-streaks'
  | 'login-count';

export interface Todo {
  id: string;
  title: string;
  description: string;
  plannedDate: Date;
}
