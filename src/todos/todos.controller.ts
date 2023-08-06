import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getSelectedWeekTodos(@Req() req: CustomRequest) {
    const result = await this.todosService.getTodosBySelectedWeek(req);
    return createResponse(undefined, result.data);
  }

  // get all todos by selected day
  @Get('day')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getSelectedDayTodos(@Req() req: CustomRequest) {
    const result = await this.todosService.getMonthlyTodosBySelectedDay(req);
    return createResponse(undefined, result.data);
  }

  // get all todos
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getTodos(@Req() req: CustomRequest) {
    const result = await this.todosService.getAllTodos(req);
    return createResponse(undefined, result.data);
  }

  // get future todos
  @Get('upcoming')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getFutureTodos(@Req() req: CustomRequest) {
    const result = await this.todosService.getFutureTodos(req);
    return createResponse(undefined, result.data);
  }

  // post todo
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.todosService.createTodo(createTodoDto, req);
    return createResponse(result.message);
  }

  // get todo by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getTodoById(@Param() params: { id: string }) {
    const result = await this.todosService.getTodoById(params.id);
    return createResponse(undefined, result.data);
  }

  // get todos by goalid
  @Get('goal/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getTodosByGoalId(@Param() params: { id: string }) {
    const result = await this.todosService.getTodosByGoalId(params.id);
    return createResponse(undefined, result.data);
  }

  // edit todo
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.todosService.updateTodo(id, updateTodoDto, req);
    return createResponse(result.message);
  }

  // delete todo
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteTodo(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.todosService.deleteTodo(id, req);
    return createResponse(result.message, result.data);
  }
}
