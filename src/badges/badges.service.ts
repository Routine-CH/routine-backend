import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}
  async getBadgeById(id: string) {
    const badge = await this.prisma.badge.findUnique({
      where: {
        id: id,
      },
      select: {
        title: true,
        description: true,
        imageUrl: true,
      },
    });

    if (badge.imageUrl) {
      const key = badge.imageUrl.split('.amazonaws.com/')[1];
      badge.imageUrl = await this.s3Service.getSignedUrl(key);
    }

    const badgeAssignedAt = await this.prisma.userBadges.findFirst({
      where: {
        badgeId: id,
      },
      select: {
        assignedAt: true,
      },
    });

    if (!badge) {
      throw new Error('Badge not found');
    }

    if (!badgeAssignedAt) {
      throw new Error('Badge not assigned');
    }

    return {
      data: {
        ...badge,
        assignedAt: badgeAssignedAt.assignedAt,
      },
    };
  }
}
