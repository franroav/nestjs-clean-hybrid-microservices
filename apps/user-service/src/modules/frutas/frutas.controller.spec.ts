import { Test, TestingModule } from '@nestjs/testing';
import { FrutasController } from './frutas.controller';
import { FrutasService } from './frutas.service';

describe('FrutasController', () => {
  let controller: FrutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrutasController],
      providers: [FrutasService],
    }).compile();

    controller = module.get<FrutasController>(FrutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
