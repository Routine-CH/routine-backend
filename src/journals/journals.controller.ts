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
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  // Get all journals by selected week
  @Get('week')
  @UseGuards(JwtAuthGuard)
  getSelectedWeekJournals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.journalsService.getJournalsBySelectedWeek(req, res);
  }

  // Get all journals by selected day
  @Get('day')
  @UseGuards(JwtAuthGuard)
  getSelectedDayJournals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.journalsService.getJournalsBySelectedDay(req, res);
  }

  // Get all journals
  @Get()
  @UseGuards(JwtAuthGuard)
  async getJournals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.journalsService.getJournals(req, res);
  }

  // Post journal
  @Post()
  @UseGuards(JwtAuthGuard)
  async createJournal(
    @Body() createJournalDto: CreateJournalDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    return await this.journalsService.createJournal(createJournalDto, req, res);
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
  async updateJournal(
    @Param('id') id: string,
    @Body() updateJournalDto: UpdateJournalDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    return this.journalsService.updateJournal(id, updateJournalDto, req, res);
  }

  // Delete journal
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteJournal(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    res: Response,
  ) {
    return this.journalsService.deleteJournal(id, req, res);
  }
}
