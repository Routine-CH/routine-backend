import {
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
import { createResponse } from 'src/utils/helper/functions';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  // Get all journals by selected week
  @Get('week')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getSelectedWeekJournals(@Req() req: CustomRequest) {
    const result = await this.journalsService.getJournalsBySelectedWeek(req);
    return createResponse(undefined, result.data);
  }

  // Get all journals by selected day
  @Post('day')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getSelectedDayJournals(@Req() req: CustomRequest) {
    const result = await this.journalsService.getMonthlyJournalsBySelectedDay(
      req,
    );
    return createResponse(undefined, result.data);
  }

  // Get all journals
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getJournals(@Req() req: CustomRequest) {
    const journalsAndBadge = await this.journalsService.getAllJournals(req);
    return createResponse(undefined, journalsAndBadge);
  }

  // get journal moods
  @Get('moods')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getJournalMoods() {
    const result = await this.journalsService.getJournalMoods();
    return createResponse(undefined, result.data);
  }

  // Post journal
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async createJournal(
    @Body() createJournalDto: CreateJournalDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.journalsService.createJournal(
      createJournalDto,
      req,
    );
    return createResponse(result.message);
  }

  // Get journal by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getJournalById(@Param() params: { id: string }) {
    const result = await this.journalsService.getJournalById(params.id);
    return createResponse(undefined, result.data);
  }

  // edit journal
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async updateJournal(
    @Param('id') id: string,
    @Body() updateJournalDto: UpdateJournalDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.journalsService.updateJournal(
      id,
      updateJournalDto,
      req,
    );
    return createResponse(result.message);
  }

  // Delete journal
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteJournal(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.journalsService.deleteJournal(id, req);
    return createResponse(result.message, result.data);
  }
}
