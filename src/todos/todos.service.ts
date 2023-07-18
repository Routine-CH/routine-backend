import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseMessages } from 'src/utils/return-types.ts/response-messages';
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
    if (!todos) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.WEEKLY_TODOS,
      );
    }
    return { data: todos };
  }

  // get todos by specific date
  async getMonthlyTodosBySelectedDay(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // parse the selected date from the request body
    const { selectedDate } = req.body;
    const date = new Date(selectedDate);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // get the todos for the selected date
    const todos = await this.prisma.todo.findMany({
      where: {
        userId: userId,
        plannedDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        id: true,
        title: true,
        plannedDate: true,
      },
      orderBy: {
        plannedDate: 'asc',
      },
    });
    // if no todos are found, throw an error
    if (!todos) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.DAILY_TODOS,
      );
    }
    return { data: todos };
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
        description: true,
        plannedDate: true,
        completed: true,
      },
    });
    // if no todos are found, throw an error
    if (!todos) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.TODOS,
      );
    }
    return { data: todos };
  }

  // get future todos
  async getFutureTodos(req: CustomRequest) {
    // get the user id from the JWT token
    const userId = req.user.id;

    // get current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // get all future todos
    const todos = await this.prisma.todo.findMany({
      where: {
        userId: userId,
        plannedDate: {
          gt: currentDate,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        plannedDate: true,
        completed: true,
      },
      orderBy: {
        plannedDate: 'asc', // order by plannedDate to make sure todos are sequential
      },
    });

    // if no todos are found, throw an error
    if (!todos) {
      throw new NotFoundException(
        ApiResponseMessages.error.not_found_404.FUTURE_TODOS,
      );
    }

    // Group todos by plannedDate
    const groupedTodos = todos.reduce((acc, todo) => {
      // convert date to YYYY-MM-DD format
      const date = todo.plannedDate.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(todo);
      return acc;
    }, {});

    return { data: groupedTodos };
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
      return { message: ApiResponseMessages.success.created_201.TODO };
    } else {
      throw new BadRequestException(
        ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
      );
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
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.TODO);
    }
    return { data: todo };
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
      throw new NotFoundException(ApiResponseMessages.error.not_found_404.TODO);
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
        return { message: ApiResponseMessages.success.ok_200.TODO_UPDATED };
      } else {
        // if the todo was not updated, throw an error
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
        );
      }
    } else {
      // if the user is not the owner of the todo, throw an error
      throw new UnauthorizedException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
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
        const todoDeleteMessage =
          ApiResponseMessages.success.ok_200.TODO_DELETED(deleteTodo.title);
        return {
          message: todoDeleteMessage,
          data: deleteTodo,
        };
      } else {
        // if the todo was not deleted, throw an error
        throw new BadRequestException(
          ApiResponseMessages.error.bad_request_400.GENERAL_EXCEPTION,
        );
      }
    } else {
      // if the user is not the owner of the todo, throw an error
      throw new BadRequestException(
        ApiResponseMessages.error.unauthorized_401.UNAUTHORIZED,
      );
    }
  }
}
