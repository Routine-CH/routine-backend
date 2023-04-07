import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/utils/types';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  // get todos by selected week
  async getTodosBySelectedWeek(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the start and end dates of the selected week from the request body
    const { startOfWeek, endOfWeek } = req.body;

    // get the todos for the selected week
    const todos = await this.prisma.todo.findMany({
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

    // if no todos are found, throw an error
    if (!todos || todos.length === 0) {
      throw new NotFoundException(`Oops! No todos found for this week.`);
    }
    return todos;
  }

  // get todos by specific date
  async getTodosBySelectedDay(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the selected date from the request body
    const { selectedDate } = req.body;
    // get the start and end of the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // get the todos for the selected date
    const todos = await this.prisma.todo.findMany({
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
    // if no todos are found, throw an error
    if (!todos || todos.length === 0) {
      throw new NotFoundException(`Oops! No todos found for this day.`);
    }
    return todos;
  }

  // get all todos
  async getAllTodos(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // get all todos
    const todos = await this.prisma.todo.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        plannedDate: true,
      },
    });
    // if no todos are found, throw an error
    if (!todos || todos.length === 0) {
      throw new NotFoundException(`Oops! No todos found.`);
    }
    return todos;
  }

  // create todo with the JWT token provided
  async createTodo(createTodoDto: CreateTodoDto, req: CustomRequest) {
    const { title, description, plannedDate } = createTodoDto;
    const dateToComplete = new Date(plannedDate);
    // get the user id from the JWT token
    const userId = req.user.id;
    // create the todo
    const todo = await this.prisma.todo.create({
      data: {
        title: title,
        description: description,
        plannedDate: dateToComplete,
        completed: false,
        user: { connect: { id: userId } },
      },
    });
    // check if the todo was created
    if (todo) {
      return { message: 'Todo created successfully.' };
    } else {
      throw new BadRequestException('Something went wrong. Please try again.');
    }
  }

  // get todo by id
  async getTodoById(id: string) {
    // get the todo by id
    const todo = await this.prisma.todo.findUnique({
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
    // if no todo is found, throw an error
    if (!todo) {
      throw new BadRequestException('Something went wrong. Please try again.');
    }
    return todo;
  }

  // update todo
  async updateTodo(
    id: string,
    updateTodoDto: UpdateTodoDto,
    req: CustomRequest,
  ) {
    const { title, description, plannedDate, completed } = updateTodoDto;
    const dateToComplete = new Date(plannedDate);
    // find the todo by id to update
    const todoToEdit = await this.prisma.todo.findUnique({
      where: {
        id: id,
      },
    });

    // implement check to see if the todo exists
    if (!todoToEdit) {
      throw new NotFoundException('Oops! Todo not found.');
    }

    // check if the user is the owner of the todo
    if (req.user.id === todoToEdit.userId) {
      // update the todo
      const editTodo = await this.prisma.todo.update({
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
      // check if the todo was updated
      if (editTodo) {
        return { message: 'Todo updated successfully.' };
      } else {
        // if the todo was not updated, throw an error
        throw new BadRequestException(
          'Oops! Something went wrong. Please try again.',
        );
      }
    } else {
      // if the user is not the owner of the todo, throw an error
      throw new UnauthorizedException(
        'You are not authorized to edit this todo.',
      );
    }
  }

  // delete todo
  async deleteTodo(id: string, req: CustomRequest) {
    // find the todo by id to delete
    const todoToDelete = await this.prisma.todo.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        userId: true,
        title: true,
      },
    });
    // check if the user is the owner of the todo
    if (req.user.id === todoToDelete.userId) {
      // delete the todo
      const deleteTodo = await this.prisma.todo.delete({
        where: {
          id: id,
        },
      });
      // check if the todo was deleted
      if (deleteTodo) {
        return {
          message: `Todo ${todoToDelete.title} was succesfully deleted.`,
          deleteTodo: deleteTodo,
        };
      } else {
        // if the todo was not deleted, throw an error
        throw new BadRequestException(
          'Something went wrong. Please try again.',
        );
      }
    } else {
      // if the user is not the owner of the todo, throw an error
      throw new BadRequestException(
        'You are not authorized to delete this todo.',
      );
    }
  }
}
