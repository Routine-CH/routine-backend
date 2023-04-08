// gamification.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BadgeInfo } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';

@Injectable()
export class GamificationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<CustomRequest>();

    return next.handle().pipe(
      map((data) => {
        const earnedBadge: BadgeInfo | null = request.user.earnedBadge;

        if (earnedBadge) {
          return {
            ...data,
            earnedBadge,
          };
        } else {
          return data;
        }
      }),
    );
  }
}
