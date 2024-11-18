import { Test, TestingModule } from '@nestjs/testing';
import { AgricultoresController } from './agricultores.controller';
import { AgricultoresService } from './agricultores.service';

describe('AgricultoresController', () => {
  let controller: AgricultoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgricultoresController],
      providers: [AgricultoresService],
    }).compile();

    controller = module.get<AgricultoresController>(AgricultoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
