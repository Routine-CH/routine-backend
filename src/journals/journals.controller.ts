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
import { Response } from 'express';
import { CustomRequest } from 'src/utils/types';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  // Get all journals by selected week
  @Get('week')
  @UseGuards(AuthGuard('jwt'))
  getSelectedWeekJournals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.journalsService.getJournalsBySelectedWeek(req, res);
  }

  // Get all journals by selected day
  @Get('day')
  @UseGuards(AuthGuard('jwt'))
  getSelectedDayJournals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.journalsService.getJournalsBySelectedDay(req, res);
  }

  // Get journal by id
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getJournalById(@Param() params: { id: string }) {
    return this.journalsService.getJournalById(params.id);
  }

  // Get all journals
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getJournals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.journalsService.getJournals(req, res);
  }

  // Post journal
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createJournal(
    @Body() createJournalDto: CreateJournalDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    return await this.journalsService.createJournal(createJournalDto, req, res);
  }

  // Edit journal
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async deleteJournal(
    @Param('id') id: string,
    @Req() req: CustomRequest,
    res: Response,
  ) {
    return this.journalsService.deleteJournal(id, req, res);
  }
}
