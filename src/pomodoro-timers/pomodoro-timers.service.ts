import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePomodoroTimerDto } from './dto/pomodoro-timer.dto';

@Injectable()
export class PomodoroTimersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertPomodoroTimer(
    createPomodoroTimerDto: CreatePomodoroTimerDto,
    userId: string,
  ) {
    // get duration from body in seconds
    const { durationInSeconds } = createPomodoroTimerDto;

    // check if a record for the user already exists
    const existingPomodoroRecord = await this.prisma.pomodoroTimers.findFirst({
      where: {
        userId: userId,
      },
    });

    // if there is an existing record, update it
    if (existingPomodoroRecord) {
      const updatePomodoroDuration = await this.prisma.pomodoroTimers.update({
        where: { id: existingPomodoroRecord.id },
        data: {
          totalDuration: {
            set: existingPomodoroRecord.totalDuration + durationInSeconds,
          },
        },
      });
      return updatePomodoroDuration;
    } else {
      // create new pomodoro record
      const newPomodoroRecord = await this.prisma.pomodoroTimers.create({
        data: {
          user: { connect: { id: userId } },
          totalDuration: durationInSeconds,
        },
      });
      return newPomodoroRecord;
    }
  }
}
