import { Test, TestingModule } from '@nestjs/testing';
import { VariedadesController } from './variedades.controller';
import { VariedadesService } from './variedades.service';

describe('VariedadesController', () => {
  let controller: VariedadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariedadesController],
      providers: [VariedadesService],
    }).compile();

    controller = module.get<VariedadesController>(VariedadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
