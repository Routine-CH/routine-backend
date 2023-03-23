import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMeditationDto } from './dto/meditation.dto';

@Injectable()
export class MeditationsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertMeditation(
    createMeditationDto: CreateMeditationDto,
    userId: string,
  ) {
    // calculate duration and Math.round() it
    const { startTime, stopTime } = createMeditationDto;
    const duration = Math.round(stopTime - startTime);

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
            set: existingMeditationRecord.totalDuration + duration,
          },
        },
      });
      return updateMeditationDuration;
    } else {
      // create new meditation record
      const newMeditationRecord = await this.prisma.meditations.create({
        data: {
          user: { connect: { id: userId } },
          totalDuration: duration,
        },
      });
      return newMeditationRecord;
    }
  }
}
