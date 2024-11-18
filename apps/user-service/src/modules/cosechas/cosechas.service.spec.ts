import { Test, TestingModule } from '@nestjs/testing';
import { CosechasService } from './cosechas.service';

describe('CosechasService', () => {
  let service: CosechasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CosechasService],
    }).compile();

    service = module.get<CosechasService>(CosechasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
