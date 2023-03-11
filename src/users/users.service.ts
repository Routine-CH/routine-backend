import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        badges: true,
      },
    });
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        badges: true,
      },
    });
  }
}
