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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { promises as fs } from 'fs';
import { diskStorage } from 'multer';
import { S3Service } from 'src/s3/s3.service';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { Goal, Goals } from './../utils/return-types.ts/types';
import { CreateGoalRequestDto, UpdateGoalDto } from './dto/goal.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly s3Service: S3Service,
  ) {}

  // get all goals by selected week
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all goals for the selected week',
    type: Goals,
  })
  @ApiNotFoundResponse({ description: 'Oops! No goals found for this week' })
  @Get('week')
  @UseGuards(JwtAuthGuard)
  getSelectedWeekGoals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.goalsService.getGoalsBySelectedWeek(req, res);
  }

  // get all goals by selected day
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all goals for the selcted day',
    type: Goals,
  })
  @ApiNotFoundResponse({ description: 'Oops! No goals found for this day' })
  @Get('day')
  @UseGuards(JwtAuthGuard)
  getSelectedDayGoals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.goalsService.getGoalsBySelectedDay(req, res);
  }

  // get all goals
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all goals',
    type: Goals,
  })
  @ApiNotFoundResponse({ description: 'Oops! No goals found.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getGoals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.goalsService.getAllGoals(req, res);
  }

  // post goal
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Goal created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: diskStorage({}) }))
  async createGoal(
    @UploadedFile() file: Express.Multer.File,
    @Body() createGoalDto: CreateGoalRequestDto,
    @Req() req: CustomRequest,
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

  // get goal by id
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns goal with specific ID',
    type: Goal,
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getGoalById(@Param() params: { id: string }) {
    return this.goalsService.getGoalById(params.id);
  }

  // edit goal
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Goal updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to edit this goal',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: diskStorage({}) }))
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: CustomRequest,
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
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Goal "Goalname" was deleted successfully',
    type: Goal,
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to delete this goal',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteGoal(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    return await this.goalsService.deleteGoal(id, req, res);
  }
}
