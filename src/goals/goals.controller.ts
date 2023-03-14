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
import { CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // get all goals by selected week
  @Get('week')
  @UseGuards(AuthGuard('jwt'))
  getSelectedWeekGoals(@Req() req: Request, @Res() res: Response) {
    return this.goalsService.getGoalsBySelectedWeek(req, res);
  }

  // get all goals by selected day
  @Get('day')
  @UseGuards(AuthGuard('jwt'))
  getSelectedDayGoals(@Req() req: Request, @Res() res: Response) {
    return this.goalsService.getGoalsBySelectedDay(req, res);
  }

  // get goal by id
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getGoalById(@Param() params: { id: string }) {
    return this.goalsService.getGoalById(params.id);
  }

  // get all goals
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getGoals(@Req() req: Request, @Res() res: Response) {
    return this.goalsService.getAllGoals(req, res);
  }

  // post goal
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createGoal(
    @Body() createGoalDto: CreateGoalDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.goalsService.createGoal(createGoalDto, req, res);
  }

  // edit goal
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.goalsService.updateGoal(id, updateGoalDto, req, res);
  }

  // delete goal
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteGoal(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.goalsService.deleteGoal(id, req, res);
  }
}
