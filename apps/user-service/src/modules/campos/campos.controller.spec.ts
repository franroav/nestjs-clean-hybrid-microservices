import { Test, TestingModule } from '@nestjs/testing';
import { CamposController } from './campos.controller';
import { CamposService } from './campos.service';

describe('CamposController', () => {
  let controller: CamposController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CamposController],
      providers: [CamposService],
    }).compile();

    controller = module.get<CamposController>(CamposController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
