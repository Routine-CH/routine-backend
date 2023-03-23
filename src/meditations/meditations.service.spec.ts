import { Test, TestingModule } from '@nestjs/testing';
import { MeditationsService } from './meditations.service';

describe('MeditationsService', () => {
  let service: MeditationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeditationsService],
    }).compile();

    service = module.get<MeditationsService>(MeditationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
