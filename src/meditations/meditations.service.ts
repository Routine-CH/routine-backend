import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseMessages } from 'src/utils/return-types.ts/response-messages';
import { CreateMeditationDto } from './dto/meditation.dto';

@Injectable()
export class MeditationsService {
  constructor(private readonly prisma: PrismaService) {}

  // get meditation by user id
  async getMeditationByUserId(userId: string) {
    const meditation = await this.prisma.meditations.findFirst({
      where: { userId: userId },
    });

    // if no meditation is found, throw an error
    if (!meditation) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.MEDITATIONS,
      );
    } else {
      return { data: meditation.totalDuration };
    }
  }

  // upsert meditation
  async upsertMeditation(
    createMeditationDto: CreateMeditationDto,
    userId: string,
  ) {
    // get duration from body in seconds
    const { durationInSeconds } = createMeditationDto;

    // check if a record for the user already exists
    const existingMeditationRecord = await this.prisma.meditations.findFirst({
      where: { userId: userId },
    });

    // if there is an existing record, update it
    if (existingMeditationRecord) {
      const updateMeditationDuration = await this.prisma.meditations.update({
        where: { id: existingMeditationRecord.id },
        data: {
          totalDuration: {
            set: existingMeditationRecord.totalDuration + durationInSeconds,
          },
        },
      });
      return {
        message: ApiResponseMessages.success.ok_200.MEDITATION_UPDATED,
        data: updateMeditationDuration.totalDuration,
      };
    } else {
      // create new meditation record
      const newMeditationRecord = await this.prisma.meditations.create({
        data: {
          user: { connect: { id: userId } },
          totalDuration: durationInSeconds,
        },
      });
      return {
        message: ApiResponseMessages.success.ok_200.MEDITATION_UPDATED,
        data: newMeditationRecord.totalDuration,
      };
    }
  }
}
