import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  // get goals by selected week
  async getGoalsBySelectedWeek(req: any, res: any) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the start and end dates of the selected week from the request body
    const { startOfWeek, endOfWeek } = req.body;

    // get the journals for the selected week
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
      throw new NotFoundException(`Oops! No goals found for this week.`);
    }
    return res.status(200).json(goals);
  }

  // get goals by specific date
  async getGoalsBySelectedDay(req: any, res: any) {
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
      throw new NotFoundException(`Oops! No goals found for this day.`);
    }
    return res.status(200).json(goals);
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
        importance: true,
        vision: true,
        completed: true,
        createdAt: true,
      },
    });
    // if no goal is found, throw an error
    if (!goal) {
      throw new BadRequestException('Something went wrong. Please try again.');
    }
    return goal;
  }

  // get all goals
  async getAllGoals(req: any, res: any) {
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
    if (!goals || goals.length === 0) {
      throw new NotFoundException(`Oops! No goals found.`);
    }

    return res.status(200).json(goals);
  }

  // create goal with the JWT token provided
  async createGoal(createGoalDto: CreateGoalDto, req: any, res: any) {
    const { title, imageUrl, description, importance, vision } = createGoalDto;
    // get the user id from the JWT token
    const userId = req.user.id;
    // create the goal
    const goal = await this.prisma.goal.create({
      data: {
        title,
        imageUrl,
        description,
        importance,
        vision,
        completed: false,
        user: { connect: { id: userId } },
      },
    });
    // check if goal was created
    if (goal) {
      return res.status(201).json({ message: 'Goal created successfully.' });
    } else {
      throw new BadRequestException('Something went wrong. Please try again.');
    }
  }

  // update goal
  async updateGoal(
    id: string,
    updateGoalDto: UpdateGoalDto,
    req: any,
    res: any,
  ) {
    // find the goal to update
    const goalToEdit = await this.prisma.goal.findUnique({
      where: {
        id: id,
      },
    });

    // implement check to see if the goal exists
    if (!goalToEdit) {
      throw new NotFoundException(`Oops! Goal not found.`);
    }

    // check if the user is the owner of the goal
    if (req.user.id === goalToEdit.userId) {
      // update the goal
      const editGoal = await this.prisma.goal.update({
        where: {
          id: id,
        },
        data: updateGoalDto,
      });
      // check if goal was updated
      if (editGoal) {
        return res.status(200).json({ message: 'Goal updated successfully.' });
      } else {
        // if the goal was not updated, throw an error
        throw new BadRequestException(
          'Something went wrong. Please try again.',
        );
      }
    } else {
      // if the user is not the owner of the goal, throw an error
      throw new BadRequestException(
        'You are not authorized to edit this goal.',
      );
    }
  }

  // delete goal
  async deleteGoal(id: string, req: any, res: any) {
    // find the journal to delete
    const goalToDelete = await this.prisma.goal.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        userId: true,
        title: true,
      },
    });
    // check if the user is the owner of the goal
    if (req.user.id === goalToDelete.userId) {
      // delete the goal
      const deleteGoal = await this.prisma.goal.delete({
        where: {
          id: id,
        },
      });
      // check if goal was deleted
      if (deleteGoal) {
        if (res) {
          return res.status(200).json({
            message: `Goal ${goalToDelete.title} was succesfully deleted.`,
            deleteGoal: deleteGoal,
          });
        } else {
          return {
            message: `Goal ${goalToDelete.title} was succesfully deleted.`,
            deleteGoal: deleteGoal,
          };
        }
      } else {
        // if the goal was not deleted, throw an error
        throw new BadRequestException(
          'Something went wrong. Please try again.',
        );
      }
    } else {
      // if the user is not the owner of the goal, throw an error
      throw new BadRequestException(
        'You are not authorized to delete this goal.',
      );
    }
  }
}
