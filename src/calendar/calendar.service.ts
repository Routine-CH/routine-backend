import { Injectable } from '@nestjs/common';
import { GoalsService } from 'src/goals/goals.service';
import { JournalsService } from 'src/journals/journals.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodosService } from 'src/todos/todos.service';
import { CustomRequest } from 'src/utils/types';

@Injectable()
export class CalendarService {
  constructor(
    private prisma: PrismaService,
    private goalsService: GoalsService,
    private todosService: TodosService,
    private journalsService: JournalsService,
  ) {}

  async getCalendarData(req: CustomRequest) {
    const goalsResponse = await this.goalsService.getMonthlyGoalsBySelectedDay(
      req,
    );
    const todosResponse = await this.todosService.getMonthlyTodosBySelectedDay(
      req,
    );
    const journalsResponse =
      await this.journalsService.getMonthlyJournalsBySelectedDay(req);

    const goals = goalsResponse.data;
    const todos = todosResponse.data;
    const journals = journalsResponse.data;

    const aggregatedData = {};

    goals.forEach((goal) => {
      const dateKey = goal.createdAt.toISOString().split('T')[0];
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = { goals: [], todos: [], journals: [] };
      }
      aggregatedData[dateKey].goals.push(goal);
    });

    todos.forEach((todo) => {
      const dateKey = todo.plannedDate.toISOString().split('T')[0];
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = { goals: [], todos: [], journals: [] };
      }
      aggregatedData[dateKey].todos.push(todo);
    });

    journals.forEach((journal) => {
      const dateKey = journal.createdAt.toISOString().split('T')[0];
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = { goals: [], todos: [], journals: [] };
      }
      aggregatedData[dateKey].journals.push(journal);
    });

    const aggregatedDataArray = Object.keys(aggregatedData).map((dateKey) => {
      return {
        date: dateKey,
        data: aggregatedData[dateKey],
      };
    });

    aggregatedDataArray.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return { data: aggregatedDataArray };
  }
}
