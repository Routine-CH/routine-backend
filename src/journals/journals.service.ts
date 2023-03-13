import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';

@Injectable()
export class JournalsService {
  constructor(private prisma: PrismaService) {}

  // Get single journal by id
  async getJournalById(id: string) {
    const journal = await this.prisma.journal.findUnique({
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

    if (!journal) {
      throw new NotFoundException(`Oops! Journal doesn't exist.`);
    }

    return journal;
  }

  // Get all journals
  async getJournals(req: any, res: any) {
    const userId = req.user.id;
    const allUserJounals = await this.prisma.journal.findMany({
      where: { userId: userId },
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
    return res.status(200).json(allUserJounals);
  }

  // Create journal with the JWT token provided
  async createJournal(createJournalDto: CreateJournalDto, req: any, res: any) {
    const { title, mood, moodDescription, activity, toImprove } =
      createJournalDto;
    // get the user id from the JWT token
    const userId = req.user.id;
    // create the journal
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

  // Update journal
  async updateJournal(
    id: string,
    updateJournalDto: UpdateJournalDto,
    req: any,
    res: any,
  ) {
    // find the journal to edit
    const journalToEdit = await this.prisma.journal.findUnique({
      where: { id },
    });
    // check if the user is the owner of the journal
    if (req.user.id === journalToEdit.userId) {
      const editJournal = await this.prisma.journal.update({
        where: { id },
        data: updateJournalDto,
      });
      // check if the journal was updated
      if (editJournal) {
        return res.status(200).json(editJournal);
      } else {
        // if the journal was not updated, throw an error
        throw new BadRequestException(
          'Something went wrong, please try again.',
        );
      }
    } else {
      // if the user is not the owner of the journal, throw an error
      throw new UnauthorizedException(
        'You are not authorized to edit this journal.',
      );
    }
  }

  // Get journal by specific week
  async getJournalsBySelectedWeek(req: any, res: any) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the start and end dates of the selected week from the request body
    const { startOfWeek, endOfWeek } = req.body;

    // get the journals for the selected week
    const journals = await this.prisma.journal.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: new Date(startOfWeek),
          lte: new Date(endOfWeek),
        },
      },
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
    if (!journals || journals.length === 0) {
      throw new NotFoundException(`Oops! No journals found for this week.`);
    }
    return res.status(200).json(journals);
  }
}
