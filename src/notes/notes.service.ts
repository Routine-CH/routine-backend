import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseMessages } from 'src/utils/return-types.ts/response-messages';
import { CustomRequest } from 'src/utils/types';
import { S3Service } from './../s3/s3.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}

  async getNotesBySelectedWeek(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the start and end dates of the selected week from the request body
    const { startOfWeek, endOfWeek } = req.body;

    // get the notes for the selected week
    const notes = await this.prisma.note.findMany({
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
        description: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
        createdAt: true,
      },
    });

    // if no notes are found, throw an error
    if (!notes || notes.length === 0) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.WEEKLY_NOTES,
      );
    }
    return { data: notes };
  }

  async getNotesBySelectedDay(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the selected date from the request body
    const { selectedDate } = req.body;
    // get the start and end of the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // get the notes for the selected date
    const notes = await this.prisma.note.findMany({
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
        description: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
        createdAt: true,
      },
    });

    // if no notes are found, throw an error
    if (!notes || notes.length === 0) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.DAILY_NOTES,
      );
    }
    return { data: notes };
  }

  async getAllNotes(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // get all the notes for the user
    const notes = await this.prisma.note.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
        createdAt: true,
      },
    });

    for (const note of notes) {
      if (note.images) {
        for (const image of note.images) {
          const key = image.imageUrl.split('.amazonaws.com/')[1];
          image.imageUrl = await this.s3Service.getSignedUrl(key);
        }
      }
    }

    // if no notes are found, throw an error
    if (!notes || notes.length === 0) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.NOTES,
      );
    }
    return { data: notes };
  }

  async createNote(
    title: string,
    description: string,
    images: Express.Multer.File[],
    user: any,
  ) {
    const imageUrls = await Promise.all(
      images.map((image) =>
        this.s3Service.uploadImage(
          image.buffer,
          image.mimetype,
          `${user.username}/notes/${Date.now()}-${image.originalname}`,
        ),
      ),
    );

    const note = await this.prisma.note.create({
      data: {
        title,
        description,
        user: { connect: { id: user.id } },
        images: {
          create: imageUrls.map((imageUrl) => ({ imageUrl })),
        },
      },
    });

    if (note) {
      return {
        message: ApiResponseMessages.success.created_201.NOTE,
        data: note,
      };
    } else {
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
      );
    }
  }

  async getNoteById(id: string) {
    const note = await this.prisma.note.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
        createdAt: true,
      },
    });

    if (!note) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.NOTE);
    }

    if (note.images) {
      for (const image of note.images) {
        const key = image.imageUrl.split('.amazonaws.com/')[1];
        image.imageUrl = await this.s3Service.getSignedUrl(key);
      }
    }

    return {
      data: note,
    };
  }

  async updateNote(
    id: string,
    title: string,
    description: string,
    images: Express.Multer.File[],
    user: any,
  ) {
    const noteToUpdate = await this.prisma.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!noteToUpdate) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.NOTE);
    }

    if (user.id !== noteToUpdate.userId) {
      throw new UnauthorizedException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
      );
    }

    const imageUrls = await Promise.all(
      images.map((image) =>
        this.s3Service.uploadImage(
          image.buffer,
          image.mimetype,
          `${user.username}/notes/${Date.now()}-${image.originalname}`,
        ),
      ),
    );

    const note = await this.prisma.note.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        images: {
          create: imageUrls.map((imageUrl) => ({ imageUrl })),
        },
      },
    });

    if (note) {
      return {
        message: ApiResponseMessages.success.ok_200.NOTE_UPDATED,
        data: note,
      };
    } else {
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
      );
    }
  }

  async deleteNoteById(id: string, req: CustomRequest) {
    // Find the note to delete.
    const noteToDelete = await this.prisma.note.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    // If the note doesn't exist, throw an exception.
    if (!noteToDelete) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.NOTE);
    }

    // Check if the user is the owner of the note.
    if (req.user.id !== noteToDelete.userId) {
      throw new UnauthorizedException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
      );
    }

    // Delete the images associated with the note from S3
    await Promise.all(
      noteToDelete.images.map((image) =>
        this.s3Service.deleteImage(image.imageUrl),
      ),
    );

    // If the user is the owner, delete the note.
    const deletedNote = await this.prisma.note.delete({
      where: {
        id: id,
      },
    });

    if (deletedNote) {
      const noteDeletedMessage =
        ApiResponseMessages.success.ok_200.NOTE_DELETED(noteToDelete.title);
      // Return a success message.
      return {
        message: noteDeletedMessage,
        data: deletedNote,
      };
    }
  }
}
