import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JournalsService {
  constructor(private prisma: PrismaService) {}

  async getJournalById(id: string) {
    return await this.prisma.journal.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        mood: true,
        moodDescription: true,
        activity: true,
        toImprove: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getJournals() {
    return await this.prisma.journal.findMany({
      select: {
        id: true,
        title: true,
        mood: true,
        moodDescription: true,
        activity: true,
        toImprove: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
