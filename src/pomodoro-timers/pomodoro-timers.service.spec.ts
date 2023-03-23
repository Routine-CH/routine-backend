import { Test, TestingModule } from '@nestjs/testing';
import { PomodoroTimersService } from './pomodoro-timers.service';

describe('PomodoroTimersService', () => {
  let service: PomodoroTimersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PomodoroTimersService],
    }).compile();

    service = module.get<PomodoroTimersService>(PomodoroTimersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
