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
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // get week's task
  @Get('week')
  @UseGuards(AuthGuard('jwt'))
  getSelectedWeekTasks(@Req() req: Request, @Res() res: Response) {
    return this.tasksService.getTasksBySelectedWeek(req, res);
  }

  // get all tasks by selected day
  @Get('day')
  @UseGuards(AuthGuard('jwt'))
  getSelectedDayTasks(@Req() req: Request, @Res() res: Response) {
    return this.tasksService.getTasksBySelectedDay(req, res);
  }

  // get task by id
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getTaskById(@Param() params: { id: string }) {
    return this.tasksService.getTaskById(params.id);
  }

  // get all tasks
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getTasks(@Req() req: Request, @Res() res: Response) {
    return this.tasksService.getAllTasks(req, res);
  }

  // post task
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.tasksService.createTask(createTaskDto, req, res);
  }

  // edit task
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.tasksService.updateTask(id, updateTaskDto, req, res);
  }

  // delete task
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTask(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.tasksService.deleteTask(id, req, res);
  }
}
