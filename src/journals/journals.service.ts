import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto } from './dto/journal.dto';

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

  async createJournal(dto: CreateJournalDto, req: any, res: any) {
    console.log(req.user.username);
    const { title, mood, moodDescription, activity, toImprove } = dto;
    const userId = req.user.id;
    const journal = await this.prisma.journal.create({
      data: {
        title,
        mood,
        moodDescription,
        activity,
        toImprove,
        user: { connect: { id: userId } },
      },
    });
    return res.status(201).json(journal);
  }
}
