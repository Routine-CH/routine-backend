import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateJournalDto } from './dto/journal.dto';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  // Get journal by id
  @Get(':id')
  getJournalById(@Param() params: { id: string }) {
    return this.journalsService.getJournalById(params.id);
  }

  // Get all journals
  @Get()
  getJournals() {
    return this.journalsService.getJournals();
  }

  // Post journal
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createJournal(@Body() dto: CreateJournalDto, @Req() req, @Res() res) {
    return await this.journalsService.createJournal(dto, req, res);
  }
}
