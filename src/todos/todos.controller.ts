import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // get week's todos
  @Get('week')
  @UseGuards(JwtAuthGuard)
  getSelectedWeekTodos(@Req() req: CustomRequest) {
    return this.todosService.getTodosBySelectedWeek(req);
  }

  // get all todos by selected day
  @Get('day')
  @UseGuards(JwtAuthGuard)
  getSelectedDayTodos(@Req() req: CustomRequest) {
    return this.todosService.getTodosBySelectedDay(req);
  }

  // get all todos
  @Get()
  @UseGuards(JwtAuthGuard)
  async getTodos(@Req() req: CustomRequest) {
    const todossAndGoals = await this.todosService.getAllTodos(req);
    return todossAndGoals;
  }

  // post todo
  @Post()
  @UseGuards(JwtAuthGuard)
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: CustomRequest,
  ) {
    return await this.todosService.createTodo(createTodoDto, req);
  }

  // get todo by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getTodoById(@Param() params: { id: string }) {
    return this.todosService.getTodoById(params.id);
  }

  // edit todo
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: CustomRequest,
  ) {
    return await this.todosService.updateTodo(id, updateTodoDto, req);
  }

  // delete todo
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTodo(@Param('id') id: string, @Req() req: CustomRequest) {
    return await this.todosService.deleteTodo(id, req);
  }
}
