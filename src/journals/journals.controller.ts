import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateJournalDto, UpdateJournalDto } from './dto/journal.dto';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  // Get current week's journal
  @Get('my-journey')
  @UseGuards(AuthGuard('jwt'))
  getSelectedWeekJournal(@Req() req: Request, @Res() res: Response) {
    return this.journalsService.getJournalsBySelectedWeek(req, res);
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
  async getJournals(@Req() req: Request, @Res() res: Response) {
    return this.journalsService.getJournals(req, res);
  }

  // Post journal
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createJournal(
    @Body() createJournalDto: CreateJournalDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.journalsService.createJournal(createJournalDto, req, res);
  }

  // Edit journal
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateJournalDto: UpdateJournalDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.journalsService.updateJournal(id, updateJournalDto, req, res);
  }
}
