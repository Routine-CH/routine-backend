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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Journal, Journals } from 'src/utils/return-types.ts/types';
import { CustomRequest } from 'src/utils/types';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  // Get all journals by selected week
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all journals for the selected week',
    type: Journals,
  })
  @ApiNotFoundResponse({ description: 'Oops! No journals found for this week' })
  @Get('week')
  @UseGuards(JwtAuthGuard)
  getSelectedWeekJournals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.journalsService.getJournalsBySelectedWeek(req, res);
  }

  // Get all journals by selected day
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all journals for the selcted day',
    type: Journals,
  })
  @ApiNotFoundResponse({ description: 'Oops! No journals found for this day' })
  @Get('day')
  @UseGuards(JwtAuthGuard)
  getSelectedDayJournals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.journalsService.getJournalsBySelectedDay(req, res);
  }

  // Get all journals
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns all journals',
    type: Journals,
  })
  @ApiNotFoundResponse({
    description: `Oops! You don't have any journals yet.`,
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getJournals(@Req() req: CustomRequest, @Res() res: Response) {
    return this.journalsService.getJournals(req, res);
  }

  // Post journal
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Journal created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
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
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Returns goal with specific ID',
    type: Journal,
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getJournalById(@Param() params: { id: string }) {
    return this.journalsService.getJournalById(params.id);
  }

  // edit journal
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Journal updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @ApiNotFoundResponse({ description: 'Oops! No journal found' })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to edit this goal',
  })
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
  @ApiHeader({
    name: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
    SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    description: 'Authorization',
  })
  @ApiCreatedResponse({
    description: 'Goal "Goalname" was deleted successfully',
    type: Journal,
  })
  @ApiBadRequestResponse({
    description: 'Oops! Something went wrong. Please try again',
  })
  @ApiUnauthorizedResponse({
    description: 'You are not authorized to delete this goal',
  })
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
