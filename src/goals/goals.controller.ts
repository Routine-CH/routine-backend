import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer';
import { S3Service } from 'src/s3/s3.service';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { CreateGoalRequestDto, UpdateGoalDto } from './dto/goal.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly s3Service: S3Service,
  ) {}

  // get all goals by selected week
  @Get('week')
  @UseGuards(JwtAuthGuard)
  getSelectedWeekGoals(@Req() req: CustomRequest) {
    return this.goalsService.getGoalsBySelectedWeek(req);
  }

  // get all goals by selected day
  @Get('day')
  @UseGuards(JwtAuthGuard)
  getSelectedDayGoals(@Req() req: CustomRequest) {
    return this.goalsService.getGoalsBySelectedDay(req);
  }

  // get all goals
  @Get()
  @UseGuards(JwtAuthGuard)
  async getGoals(@Req() req: CustomRequest) {
    const goalsAndBadge = await this.goalsService.getAllGoals(req);
    return goalsAndBadge;
  }

  // create goal
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: diskStorage({}) }))
  async createGoal(
    @UploadedFile() file: Express.Multer.File,
    @Body('todosJSON') todosJSON: string[] | undefined,
    @Body() createGoalDto: CreateGoalRequestDto,
    @Req() req: CustomRequest,
  ) {
    if (todosJSON && Array.isArray(todosJSON)) {
      createGoalDto.todos = todosJSON.map((todo) => JSON.parse(todo));
    } else {
      createGoalDto.todos = [];
    }

    const buffer = file ? await fs.readFile(file.path) : undefined;
    return await this.goalsService.createGoal(
      buffer,
      file?.mimetype,
      file?.originalname,
      createGoalDto,
      req,
      this.s3Service,
    );
  }

  // get goal by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getGoalById(@Param() params: { id: string }) {
    return this.goalsService.getGoalById(params.id);
  }

  // edit goal
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: diskStorage({}) }))
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: CustomRequest,
  ) {
    const buffer = file ? await fs.readFile(file.path) : undefined;

    return await this.goalsService.updateGoal(
      id,
      buffer,
      file?.mimetype,
      file?.originalname,
      updateGoalDto,
      req,
    );
  }

  // delete goal
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteGoal(@Param('id') id: string, @Req() req: CustomRequest) {
    return await this.goalsService.deleteGoal(id, req);
  }
}
