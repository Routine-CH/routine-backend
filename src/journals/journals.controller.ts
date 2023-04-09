import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GamificationInterceptor } from 'src/interceptors/gamification.interceptor';
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
  getSelectedWeekJournals(@Req() req: CustomRequest) {
    return this.journalsService.getJournalsBySelectedWeek(req);
  }

  // Get all journals by selected day
  @Get('day')
  @UseGuards(JwtAuthGuard)
  getSelectedDayJournals(@Req() req: CustomRequest) {
    return this.journalsService.getJournalsBySelectedDay(req);
  }

  // Get all journals
  @Get()
  @UseGuards(JwtAuthGuard)
  async getJournals(@Req() req: CustomRequest) {
    const journalsAndBadge = await this.journalsService.getAllJournals(req);
    return journalsAndBadge;
  }

  // Post journal
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GamificationInterceptor)
  async createJournal(
    @Body() createJournalDto: CreateJournalDto,
    @Req() req: CustomRequest,
  ) {
    return await this.journalsService.createJournal(createJournalDto, req);
  }

  // Get journal by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getJournalById(@Param() params: { id: string }) {
    return this.journalsService.getJournalById(params.id);
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
    return this.journalsService.updateJournal(id, updateJournalDto, req);
  }

  // Delete journal
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteJournal(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.journalsService.deleteJournal(id, req);
  }
}
