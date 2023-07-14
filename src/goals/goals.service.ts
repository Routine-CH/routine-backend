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
import { CreateGoalRequestDto, UpdateGoalDto } from './dto/goal.dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}

  // get goals by selected week
  async getGoalsBySelectedWeek(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the start and end dates of the selected week from the request body
    const { startOfWeek, endOfWeek } = req.body;

    // get the goals for the selected week
    const goals = await this.prisma.goal.findMany({
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

    // if no goals are found, throw an error
    if (!goals || goals.length === 0) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.WEEKLY_GOALS,
      );
    }
    return { data: goals };
  }

  // get goals by specific date
  async getGoalsBySelectedDay(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the selected date from the request body
    const { selectedDate } = req.body;
    // get the start and end of the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // get the goals for the selected date
    const goals = await this.prisma.goal.findMany({
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
    // if no goals are found, throw an error
    if (!goals || goals.length === 0) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.DAILY_GOALS,
      );
    }
    return { data: goals };
  }

  // get all goals
  async getAllGoals(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // get all goals
    const goals = await this.prisma.goal.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
      },
    });

    // if no goals are found, throw an error
    if (!goals) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.GOALS,
      );
    }

    return goals;
  }

  // create goal with the JWT token provided
  async createGoal(
    buffer: Buffer | undefined,
    mimetype: string | undefined,
    originalname: string | undefined,
    createGoalDto: CreateGoalRequestDto,
    req: CustomRequest,
    s3Service: S3Service,
  ) {
    const { title, description, todos } = createGoalDto;
    // get the user id from the JWT token
    const userId = req.user.id;

    // fetch the user from the database
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Initialize imageUrl as emtpy string or undefined
    let imageUrl: string | undefined;

    // check if the user has uploaded an image
    if (buffer && mimetype && originalname) {
      // upload image to s3 and get the image url
      const key = `${user.username}/goals/${Date.now()}-${originalname}`;
      imageUrl = await s3Service.uploadImage(buffer, mimetype, key);
    }

    // extract the ids from todos array
    const todosConnect = todos?.map((todo) => ({ id: todo.id }));

    // create the goal
    const goal = await this.prisma.goal.create({
      data: {
        title,
        imageUrl,
        description,
        completed: false,
        user: { connect: { id: userId } },
        todos: todos
          ? {
              connect: todosConnect,
            }
          : undefined,
      },
    });
    // check if goal was created
    if (goal) {
      return {
        message: ApiResponseMessages.success.created_201.GOAL,
      };
    } else {
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
      );
    }
  }

  // get goal by id
  async getGoalById(id: string) {
    const goal = await this.prisma.goal.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        description: true,
        todos: true,
        completed: true,
        createdAt: true,
      },
    });
    // if no goal is found, throw an error
    if (!goal) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.GOAL);
    }

    // generate a signed url for the image if extists
    if (goal.imageUrl) {
      const key = goal.imageUrl.split('.amazonaws.com/')[1];
      goal.imageUrl = await this.s3Service.getSignedUrl(key);
    }
    return { data: goal };
  }

  // update goal
  async updateGoal(
    id: string,
    buffer: Buffer | undefined,
    mimetype: string | undefined,
    originalname: string | undefined,
    updateGoalDto: UpdateGoalDto,
    req: CustomRequest,
  ) {
    // find the goal to update
    const goalToEdit = await this.prisma.goal.findUnique({
      where: {
        id: id,
      },
    });

    // implement check to see if the goal exists
    if (!goalToEdit) {
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.GOAL);
    }

    // check if the user is the owner of the goal
    if (req.user.id === goalToEdit.userId) {
      //convert completed field to boolean
      const { title, description, todos, completed } = updateGoalDto;

      // initialize imageUrl as existing  or undefined
      let imageUrl: string | undefined = goalToEdit.imageUrl;

      // check if a new image is provided, delete the old image and upload the new image
      if (buffer && mimetype && originalname) {
        if (imageUrl) {
          const oldKey = imageUrl.split('.amazonaws.com/')[1];
          await this.s3Service.deleteImage(oldKey);
        }
        const username = req.user.username;
        const key = `${username}/goals/${Date.now()}-${originalname}`;
        imageUrl = await this.s3Service.uploadImage(buffer, mimetype, key);
      }

      // convert completed field to boolean
      const isCompleted = completed ? Boolean(completed) : false;

      /// update the goal
      const editGoal = await this.prisma.goal.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          description: description,
          completed: isCompleted,
          imageUrl,
          todos: todos
            ? {
                set: todos.map((todo) => ({
                  id: todo.id,
                })),
              }
            : undefined,
        },
      });

      // check if goal was updated
      if (editGoal) {
        return {
          message: ApiResponseMessages.success.ok_200.GOAL_UPDATED,
        };
      } else {
        // if the goal was not updated, throw an error
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
        );
      }
    } else {
      // if the user is not the owner of the goal, throw an error
      throw new UnauthorizedException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
      );
    }
  }

  // delete goal
  async deleteGoal(id: string, req: CustomRequest) {
    // find the journal to delete
    const goalToDelete = await this.prisma.goal.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        userId: true,
        title: true,
        imageUrl: true,
      },
    });
    // check if the user is the owner of the goal
    if (req.user.id === goalToDelete.userId) {
      // initialize imageUrl as existing  or undefined
      const imageUrl: string | undefined = goalToDelete.imageUrl;

      // check if the goal has an image, delete the image
      if (imageUrl) {
        const key = imageUrl.split('.amazonaws.com/')[1];
        await this.s3Service.deleteImage(key);
      }

      // delete the goal
      const deleteGoal = await this.prisma.goal.delete({
        where: {
          id: id,
        },
      });
      // check if goal was deleted
      if (deleteGoal) {
        const goalDeletedMessage =
          ApiResponseMessages.success.ok_200.GOAL_DELETED(goalToDelete.title);

        return {
          message: goalDeletedMessage,
          data: deleteGoal,
        };
      } else {
        // if the goal was not deleted, throw an error
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
        );
      }
    } else {
      // if the user is not the owner of the goal, throw an error
      throw new UnauthorizedException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
      );
    }
  }
}
