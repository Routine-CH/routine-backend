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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer';
import { S3Service } from 'src/s3/s3.service';
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
  @UseGuards(AuthGuard('jwt'))
  getSelectedWeekGoals(@Req() req: Request, @Res() res: Response) {
    return this.goalsService.getGoalsBySelectedWeek(req, res);
  }

  // get all goals by selected day
  @Get('day')
  @UseGuards(AuthGuard('jwt'))
  getSelectedDayGoals(@Req() req: Request, @Res() res: Response) {
    return this.goalsService.getGoalsBySelectedDay(req, res);
  }

  // get goal by id
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getGoalById(@Param() params: { id: string }) {
    return this.goalsService.getGoalById(params.id);
  }

  // get all goals
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getGoals(@Req() req: Request, @Res() res: Response) {
    return this.goalsService.getAllGoals(req, res);
  }

  // post goal
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', { storage: diskStorage({}) }))
  async createGoal(
    @UploadedFile() file: Express.Multer.File,
    @Body() createGoalDto: CreateGoalRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const buffer = file ? await fs.readFile(file.path) : undefined;
    return await this.goalsService.createGoal(
      buffer,
      file?.mimetype,
      file?.originalname,
      createGoalDto,
      req,
      res,
      this.s3Service,
    );
  }

  // edit goal
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', { storage: diskStorage({}) }))
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const buffer = file ? await fs.readFile(file.path) : undefined;
    return await this.goalsService.updateGoal(
      id,
      buffer,
      file?.mimetype,
      file?.originalname,
      updateGoalDto,
      req,
      res,
    );
  }

  // delete goal
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteGoal(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.goalsService.deleteGoal(id, req, res);
  }
}
