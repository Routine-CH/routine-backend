import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/s3/s3.service';
import { PrismaService } from './../prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, S3Service, JwtService],
})
export class UsersModule {}
