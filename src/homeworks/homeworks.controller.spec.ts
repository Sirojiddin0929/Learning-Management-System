import { Test, TestingModule } from '@nestjs/testing';
import { HomeworksController } from './homeworks.controller';

describe('HomeworksController', () => {
  let controller: HomeworksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeworksController],
    }).compile();

    controller = module.get<HomeworksController>(HomeworksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
