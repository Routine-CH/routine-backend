import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // get tasks by selected week
  async getTasksBySelectedWeek(req: any, res: any) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the start and end dates of the selected week from the request body
    const { startOfWeek, endOfWeek } = req.body;

    // get the tasks for the selected week
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: userId,
        plannedDate: {
          gte: new Date(startOfWeek),
          lte: new Date(endOfWeek),
        },
      },
      select: {
        id: true,
        title: true,
        plannedDate: true,
      },
    });

    // if no tasks are found, throw an error
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`Oops! No tasks found for this week.`);
    }
    return res.status(200).json(tasks);
  }

  // get tasks by specific date
  async getTasksBySelectedDay(req: any, res: any) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the selected date from the request body
    const { selectedDate } = req.body;
    // get the start and end of the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // get the tasks for the selected date
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: userId,
        plannedDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        title: true,
        plannedDate: true,
      },
    });
    // if no tasks are found, throw an error
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`Oops! No tasks found for this day.`);
    }
    return res.status(200).json(tasks);
  }

  // get task by id
  async getTaskById(id: string) {
    // get the task by id
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        plannedDate: true,
        completed: true,
      },
    });
    // if no task is found, throw an error
    if (!task) {
      throw new BadRequestException('Something went wrong. Please try again.');
    }
    return task;
  }

  // get all tasks
  async getAllTasks(req: any, res: any) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // get all tasks
    const tasks = await this.prisma.task.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        completed: true,
        plannedDate: true,
      },
    });
    // if no tasks are found, throw an error
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`Oops! No tasks found.`);
    }
    return res.status(200).json(tasks);
  }

  // create task with the JWT token provided
  async createTask(createTaskDto: CreateTaskDto, req: any, res: any) {
    const { title, description, plannedDate } = createTaskDto;
    const dateToComplete = new Date(plannedDate);
    // get the user id from the JWT token
    const userId = req.user.id;
    // create the task
    const task = await this.prisma.task.create({
      data: {
        title: title,
        description: description,
        plannedDate: dateToComplete,
        completed: false,
        user: { connect: { id: userId } },
      },
    });
    // check if the task was created
    if (task) {
      return res.status(201).json({ message: 'Task created successfully.' });
    } else {
      throw new BadRequestException('Something went wrong. Please try again.');
    }
  }

  // update task
  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    req: any,
    res: any,
  ) {
    const { title, description, plannedDate, completed } = updateTaskDto;
    const dateToComplete = new Date(plannedDate);
    // find the task by id to update
    const taskToEdit = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    // implement check to see if the task exists
    if (!taskToEdit) {
      throw new NotFoundException('Oops! Task not found.');
    }

    // check if the user is the owner of the task
    if (req.user.id === taskToEdit.userId) {
      // update the task
      const editTask = await this.prisma.task.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          description: description,
          plannedDate: dateToComplete,
          completed,
        },
      });
      // check if the task was updated
      if (editTask) {
        return res.status(200).json({ message: 'Task updated successfully.' });
      } else {
        // if the task was not updated, throw an error
        throw new BadRequestException(
          'Something went wrong. Please try again.',
        );
      }
    } else {
      // if the user is not the owner of the task, throw an error
      throw new BadRequestException(
        'You are not authorized to edit this task.',
      );
    }
  }

  // delete task
  async deleteTask(id: string, req: any, res: any) {
    // find the task by id to delete
    const taskToDelete = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        userId: true,
        title: true,
      },
    });
    // check if the user is the owner of the task
    if (req.user.id === taskToDelete.userId) {
      // delete the task
      const deleteTask = await this.prisma.task.delete({
        where: {
          id: id,
        },
      });
      // check if the task was deleted
      if (deleteTask) {
        if (res) {
          return res.status(200).json({
            message: `Task ${taskToDelete.title} was succesfully deleted.`,
            deleteTask: deleteTask,
          });
        } else {
          return {
            message: `Task ${taskToDelete.title} was succesfully deleted.`,
            deleteTask: deleteTask,
          };
        }
      } else {
        // if the task was not deleted, throw an error
        throw new BadRequestException(
          'Something went wrong. Please try again.',
        );
      }
    } else {
      // if the user is not the owner of the task, throw an error
      throw new BadRequestException(
        'You are not authorized to delete this task.',
      );
    }
  }
}
