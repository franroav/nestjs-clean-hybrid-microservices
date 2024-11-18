import { Test, TestingModule } from '@nestjs/testing';
import { AdaptersService } from './adapters.service';
import { beforeEach, describe, it } from 'node:test';
import { strict as assert } from 'assert'; // Import Node.js assert module

describe('AdaptersService', () => {
  let service: AdaptersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdaptersService],
    }).compile();

    service = module.get<AdaptersService>(AdaptersService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
    assert(service, 'AdaptersService should be defined');
  });
});
