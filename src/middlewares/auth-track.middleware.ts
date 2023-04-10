import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getUserIdFromToken,
  updateStreak,
} from 'src/utils/gamification/gamification.utils';

@Injectable()
export class AuthTrackMiddleware implements NestMiddleware {
  constructor(
    @Inject('JWT_SERVICE') private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // get token from request
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.redirect('/auth/refresh-token');
    }

    // if token is valid
    try {
      // if  user is authenticated, extract userId from token
      const userId = getUserIdFromToken(token, this.jwtService);

      if (userId) {
        // call updateStreak function
        await updateStreak.call(this, userId, this.prisma);
      } else {
        console.log('User ID not found in token');
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    } catch (error) {
      console.error('Error in AuthTrackMiddleware:', error);
      res.redirect('/auth/refresh-token');
    }
  }
}
