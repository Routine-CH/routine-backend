import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { createResponse } from 'src/utils/helper/functions';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { CreateGoalRequestDto, UpdateGoalDto } from './dto/goal.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
  ) {}

  // get all goals by selected week
  @Get('week')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getSelectedWeekGoals(@Req() req: CustomRequest) {
    const result = await this.goalsService.getGoalsBySelectedWeek(req);
    return createResponse(undefined, result.data);
  }

  // get all goals by selected day
  @Get('day')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getSelectedDayGoals(@Req() req: CustomRequest) {
    const result = await this.goalsService.getMonthlyGoalsBySelectedDay(req);
    return createResponse(undefined, result.data);
  }

  // get all goals
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getGoals(@Req() req: CustomRequest) {
    const goalsAndBadge = await this.goalsService.getAllGoals(req);
    return createResponse(undefined, goalsAndBadge);
  }

  // create goal
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  @UseInterceptors(FileInterceptor('image', { storage: diskStorage({}) }))
  async createGoal(
    @UploadedFile() file: Express.Multer.File,
    @Body('todosJSON') todosJSON: string | undefined,
    @Body() createGoalDto: CreateGoalRequestDto,
    @Req() req: CustomRequest,
  ) {
    if (todosJSON) {
      let parsedTodos: string[] = [];
      try {
        parsedTodos = JSON.parse(todosJSON);
        const todos = await Promise.all(
          parsedTodos.map((todoId) =>
            this.prismaService.todo.findUnique({ where: { id: todoId } }),
          ),
        );
        createGoalDto.todos = todos;
      } catch {
        throw new BadRequestException('Invalid todosJSON format');
      }
    } else {
      createGoalDto.todos = [];
    }

    const buffer = file ? await fs.readFile(file.path) : undefined;
    const result = await this.goalsService.createGoal(
      buffer,
      file?.mimetype,
      file?.originalname,
      createGoalDto,
      req,
      this.s3Service,
    );

    return createResponse(result.message);
  }

  // get goal by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getGoalById(@Param() params: { id: string }) {
    const result = await this.goalsService.getGoalById(params.id);
    return createResponse(undefined, result.data);
  }

  // edit goal
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  @UseInterceptors(FileInterceptor('image', { storage: diskStorage({}) }))
  async updateGoal(
    @Param('id') id: string,
    @Body('todosJSON') todosJSON: string | undefined,
    @Body() updateGoalDto: UpdateGoalDto,
    @Body('completed') completed: boolean | undefined,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: CustomRequest,
  ) {
    if (todosJSON) {
      try {
        const todoIds = JSON.parse(todosJSON);
        const todos = await Promise.all(
          todoIds.map((todoId) =>
            this.prismaService.todo.findUnique({ where: { id: todoId } }),
          ),
        );
        updateGoalDto.todos = todos;
      } catch {
        throw new BadRequestException('Invalid todosJSON format');
      }
    } else {
      updateGoalDto.todos = [];
    }

    updateGoalDto.completed = completed;

    const buffer = file ? await fs.readFile(file.path) : undefined;
    const result = await this.goalsService.updateGoal(
      id,
      buffer,
      file?.mimetype,
      file?.originalname,
      updateGoalDto,
      req,
    );
    return createResponse(result.message);
  }

  // delete goal
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteGoal(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.goalsService.deleteGoal(id, req);
    return createResponse(result.message, result.data);
  }
}
