import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseMessages } from 'src/utils/return-types.ts/response-messages';
import { CustomRequest } from 'src/utils/types';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';

@Injectable()
export class JournalsService {
  constructor(private prisma: PrismaService) {}

  // get journals by specific week
  async getJournalsBySelectedWeek(req: CustomRequest) {
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
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.WEEKLY_JOURNALS,
      );
    }
    return { data: journals };
  }

  // get journals by specific date
  async getJournalsBySelectedDay(req: CustomRequest) {
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
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.DAILY_JOURNALS,
      );
    }
    return { data: journals };
  }

  // get all journals
  async getAllJournals(req: CustomRequest) {
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
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.JOURNALS,
      );
    }

    return allUserJounals;
  }

  // create journal with the JWT token provided
  async createJournal(createJournalDto: CreateJournalDto, req: CustomRequest) {
    const {
      title,
      moods,
      moodDescription,
      activity,
      toImprove,
      thoughtsAndIdeas,
    } = createJournalDto;
    // get the user id from the JWT token
    const userId = req.user.id;

    const journalMoodData = moods.map((moodDto) => {
      return { mood: { connect: { id: moodDto.id } } };
    });
    // create the journal
    const journal = await this.prisma.journal.create({
      data: {
        title,
        moodDescription,
        activity,
        toImprove,
        thoughtsAndIdeas,
        user: { connect: { id: userId } },
        journalMoods: { create: journalMoodData },
      },
    });
    // check if the journal was created
    if (journal) {
      return { message: ApiResponseMessages.success.created_201.JOURNAL };
    } else {
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
      );
    }
  }

  // get single journal by id
  async getJournalById(id: string) {
    const journal = await this.prisma.journal.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        moodDescription: true,
        activity: true,
        toImprove: true,
        createdAt: true,
        journalMoods: {
          select: {
            mood: {
              select: {
                id: true,
                type: true,
              },
            },
          },
        },
        thoughtsAndIdeas: true,
      },
    });
    // if no journal is found, throw an error
    if (!journal) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.JOURNAL,
      );
    }

    return { data: journal };
  }

  // get jounral moods
  async getJournalMoods() {
    const journalMoods = await this.prisma.mood.findMany();

    // if no journal moods are found, throw an error
    if (!journalMoods || journalMoods.length === 0) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.JOURNAL_MOODS,
      );
    }

    return { data: journalMoods };
  }

  // update journal
  async updateJournal(
    id: string,
    updateJournalDto: UpdateJournalDto,
    req: CustomRequest,
  ) {
    // find the journal to edit
    const journalToEdit = await this.prisma.journal.findUnique({
      where: { id },
      include: { journalMoods: true },
    });

    // implement a check to see if the journal exists
    if (!journalToEdit) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.JOURNAL,
      );
    }

    // check if the user is the owner of the journal
    if (req.user.id === journalToEdit.userId) {
      const {
        title,
        moods,
        moodDescription,
        activity,
        toImprove,
        thoughtsAndIdeas,
      } = updateJournalDto;

      const journalMoodData = moods.map((moodDto) => {
        return { mood: { connect: { id: moodDto.id } } };
      });

      // Update the journal
      const editJournal = await this.prisma.journal.update({
        where: { id },
        data: {
          title,
          moodDescription,
          activity,
          toImprove,
          thoughtsAndIdeas,
          journalMoods: {
            deleteMany: {},
            create: journalMoodData,
          },
        },
        include: { journalMoods: true },
      });

      // check if the journal was updated
      if (editJournal) {
        return { message: ApiResponseMessages.success.ok_200.JOURNAL_UPDATED };
      } else {
        // if the journal was not updated, throw an error
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
        );
      }
    } else {
      // if the user is not the owner of the journal, throw an error
      throw new UnauthorizedException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
      );
    }
  }

  // delete journal
  async deleteJournal(id: string, req: CustomRequest) {
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
        const journalDeleteMessage =
          ApiResponseMessages.success.ok_200.GOAL_DELETED(
            journalToDelete.title,
          );

        return {
          message: journalDeleteMessage,
          data: deleteJournal,
        };
      } else {
        // if the journal was not deleted, throw an error
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
        );
      }
    } else {
      // if the user is not the owner of the journal, throw an error
      throw new UnauthorizedException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
      );
    }
  }
}
