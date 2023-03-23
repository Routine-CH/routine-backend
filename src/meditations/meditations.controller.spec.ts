import { Test, TestingModule } from '@nestjs/testing';
import { MeditationsController } from './meditations.controller';

describe('MeditationsController', () => {
  let controller: MeditationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeditationsController],
    }).compile();

    controller = module.get<MeditationsController>(MeditationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
