import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { createResponse } from 'src/utils/helper/functions';
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
  async getSelectedWeekTodos(@Req() req: CustomRequest) {
    const result = await this.todosService.getTodosBySelectedWeek(req);
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // get all todos by selected day
  @Get('day')
  @UseGuards(JwtAuthGuard)
  async getSelectedDayTodos(@Req() req: CustomRequest) {
    const result = await this.todosService.getTodosBySelectedDay(req);
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // get all todos
  @Get()
  @UseGuards(JwtAuthGuard)
  async getTodos(@Req() req: CustomRequest) {
    const result = await this.todosService.getAllTodos(req);
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // post todo
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.todosService.createTodo(createTodoDto, req);
    return createResponse(HttpStatus.CREATED, result.message);
  }

  // get todo by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTodoById(@Param() params: { id: string }) {
    const result = await this.todosService.getTodoById(params.id);
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // edit todo
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.todosService.updateTodo(id, updateTodoDto, req);
    return createResponse(HttpStatus.OK, result.message);
  }

  // delete todo
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTodo(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.todosService.deleteTodo(id, req);
    return createResponse(HttpStatus.OK, result.message, result.data);
  }
}
