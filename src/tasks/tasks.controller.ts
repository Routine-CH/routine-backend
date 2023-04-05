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
import { Response } from 'express';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // get week's task
  @Get('week')
  @UseGuards(JwtAuthGuard)
  getSelectedWeekTasks(@Req() req: CustomRequest, @Res() res: Response) {
    return this.tasksService.getTasksBySelectedWeek(req, res);
  }

  // get all tasks by selected day
  @Get('day')
  @UseGuards(JwtAuthGuard)
  getSelectedDayTasks(@Req() req: CustomRequest, @Res() res: Response) {
    return this.tasksService.getTasksBySelectedDay(req, res);
  }

  // get all tasks
  @Get()
  @UseGuards(JwtAuthGuard)
  async getTasks(@Req() req: CustomRequest, @Res() res: Response) {
    return this.tasksService.getAllTasks(req, res);
  }

  // post task
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
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getTaskById(@Param() params: { id: string }) {
    return this.tasksService.getTaskById(params.id);
  }

  // edit task
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
