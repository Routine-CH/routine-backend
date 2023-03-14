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

  // get single journal by id
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
      },
    });
    // if no journal is found, throw an error
    if (!journal) {
      throw new BadRequestException('Something went wrong. Please try again.');
    }

    return journal;
  }

  // get all journals
  async getJournals(req: any, res: any) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // get all journals
    const allUserJounals = await this.prisma.journal.findMany({
      where: { userId: userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    // if no journals are found, throw an error
    if (!allUserJounals || allUserJounals.length === 0) {
      throw new NotFoundException(`Oops! You don't have any journals yet.`);
    }

    return res.status(200).json(allUserJounals);
  }

  // create journal with the JWT token provided
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
    // check if the journal was created
    if (journal) {
      return res.status(201).json({ message: 'Journal created successfully.' });
    } else {
      throw new BadRequestException('Something went wrong, please try again.');
    }
  }

  // update journal
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

    // implement a check to see if the journal exists
    if (!journalToEdit) {
      throw new NotFoundException('Journal not found.');
    }

    // check if the user is the owner of the journal
    if (req.user.id === journalToEdit.userId) {
      // update the journal
      const editJournal = await this.prisma.journal.update({
        where: { id },
        data: updateJournalDto,
      });
      // check if the journal was updated
      if (editJournal) {
        return res
          .status(200)
          .json({ message: 'Journal updated successfully.' });
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

  // get journals by specific date
  async getJournalsBySelectedDay(req: any, res: any) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the selected day from the request body
    const { selectedDate } = req.body;
    // get the start and end of the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // get the journals for the selected date
    const journals = await this.prisma.journal.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });
    // if no journals are found, throw an error
    if (!journals || journals.length === 0) {
      throw new NotFoundException(`Oops! No journals found for this day.`);
    }
    return res.status(200).json(journals);
  }

  // get journals by specific week
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
        createdAt: true,
      },
    });
    // if no journals are found, throw an error
    if (!journals || journals.length === 0) {
      throw new NotFoundException(`Oops! No journals found for this week.`);
    }
    return res.status(200).json(journals);
  }

  // delete journal
  async deleteJournal(id: string, req: any, res: any) {
    // find the journal to delete
    const journalToDelete = await this.prisma.journal.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        title: true,
      },
    });
    // check if the user is the owner of the journal
    if (req.user.id === journalToDelete.userId) {
      // delete the journal
      const deleteJournal = await this.prisma.journal.delete({
        where: { id },
      });
      // check if the journal was deleted
      if (deleteJournal) {
        if (res) {
          return res.status(200).json({
            message: `Journal ${journalToDelete.title} was succesfully deleted`,
            deleteJournal: deleteJournal,
          });
        } else {
          return {
            message: `Journal ${journalToDelete.title} was succesfully deleted`,
            deleteJournal: deleteJournal,
          };
        }
      } else {
        // if the journal was not deleted, throw an error
        throw new BadRequestException(
          'Something went wrong, please try again.',
        );
      }
    } else {
      // if the user is not the owner of the journal, throw an error
      throw new UnauthorizedException(
        'You are not authorized to delete this journal.',
      );
    }
  }
}
