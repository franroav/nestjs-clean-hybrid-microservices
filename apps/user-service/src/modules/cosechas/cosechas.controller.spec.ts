import { Test, TestingModule } from '@nestjs/testing';
import { CosechasController } from './cosechas.controller';
import { CosechasService } from './cosechas.service';

describe('CosechasController', () => {
  let controller: CosechasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CosechasController],
      providers: [CosechasService],
    }).compile();

    controller = module.get<CosechasController>(CosechasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
