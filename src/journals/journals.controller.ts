import { Controller, Get, Param } from '@nestjs/common';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @Get(':id')
  getJournalById(@Param() params: { id: string }) {
    return this.journalsService.getJournalById(params.id);
  }

  @Get()
  getJournals() {
    return this.journalsService.getJournals();
  }
}
