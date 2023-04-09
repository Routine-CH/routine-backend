// src/multer-middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

@Injectable()
export class MulterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    multer().none()(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  }
}
