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
import { JwtAuthGuard } from './../auth/jwt.guard';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  // Get all journals by selected week
  @Get('week')
  @UseGuards(JwtAuthGuard)
  async getSelectedWeekJournals(@Req() req: CustomRequest) {
    const result = await this.journalsService.getJournalsBySelectedWeek(req);
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // Get all journals by selected day
  @Get('day')
  @UseGuards(JwtAuthGuard)
  async getSelectedDayJournals(@Req() req: CustomRequest) {
    const result = await this.journalsService.getJournalsBySelectedDay(req);
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // Get all journals
  @Get()
  @UseGuards(JwtAuthGuard)
  async getJournals(@Req() req: CustomRequest) {
    const journalsAndBadge = await this.journalsService.getAllJournals(req);
    return createResponse(HttpStatus.OK, undefined, journalsAndBadge);
  }

  // Post journal
  @Post()
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
    return createResponse(HttpStatus.CREATED, result.message);
  }

  // Get journal by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getJournalById(@Param() params: { id: string }) {
    const result = await this.journalsService.getJournalById(params.id);
    return createResponse(HttpStatus.OK, undefined, result.data);
  }

  // edit journal
  @Patch(':id')
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
    return createResponse(HttpStatus.OK, result.message);
  }

  // Delete journal
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteJournal(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.journalsService.deleteJournal(id, req);
    return createResponse(HttpStatus.OK, result.message, result.data);
  }
}
