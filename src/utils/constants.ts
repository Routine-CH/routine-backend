import { SetMetadata } from '@nestjs/common';

// jwt secret
export const jwtSecret = process.env.JWT_SECRET;
// jwt refresh token secret
export const jwtRefreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
