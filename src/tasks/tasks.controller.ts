import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Task, Tasks } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // get week's task
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all tasks for the selected week',
    type: Tasks,
  })
  @ApiNotFoundResponse({ description: 'Oops! No tasks found for this week' })
  @Get('week')
  @UseGuards(JwtAuthGuard)
  getSelectedWeekTasks(@Req() req: CustomRequest, @Res() res: Response) {
    return this.tasksService.getTasksBySelectedWeek(req, res);
  }

  // get all tasks by selected day
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all tasks for the selected day',
    type: Tasks,
  })
  @ApiNotFoundResponse({ description: 'Oops! No tasks found for this day' })
  @Get('day')
  @UseGuards(JwtAuthGuard)
  getSelectedDayTasks(@Req() req: CustomRequest, @Res() res: Response) {
    return this.tasksService.getTasksBySelectedDay(req, res);
  }

  // get all tasks
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all tasks',
    type: Tasks,
  })
  @ApiNotFoundResponse({ description: 'Oops! No tasks found.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getTasks(@Req() req: CustomRequest, @Res() res: Response) {
    return this.tasksService.getAllTasks(req, res);
  }

  // post task
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Task created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    return await this.tasksService.createTask(createTaskDto, req, res);
  }

  // get task by id
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns task with specific ID',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getTaskById(@Param() params: { id: string }) {
    return this.tasksService.getTaskById(params.id);
  }

  // edit task
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Task updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @ApiNotFoundResponse({
    description: 'Oops! Task not found',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to edit this task',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    return await this.tasksService.updateTask(id, updateTaskDto, req, res);
  }

  // delete task
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Task "Taskname" was successfully deleted',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to delete this task',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    return await this.tasksService.deleteTask(id, req, res);
  }
}
