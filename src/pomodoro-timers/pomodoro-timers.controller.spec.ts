import { Test, TestingModule } from '@nestjs/testing';
import { PomodoroTimersController } from './pomodoro-timers.controller';

describe('PomodoroTimersController', () => {
  let controller: PomodoroTimersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PomodoroTimersController],
    }).compile();

    controller = module.get<PomodoroTimersController>(PomodoroTimersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
