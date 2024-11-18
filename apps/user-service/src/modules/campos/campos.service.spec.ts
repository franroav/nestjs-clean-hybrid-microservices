import { Test, TestingModule } from '@nestjs/testing';
import { CamposService } from './campos.service';
import { getModelToken } from '@nestjs/sequelize';
import { Campo } from './entities/campo.entity';
import { HttpException } from '@nestjs/common';

describe('CamposService', () => {
  let service: CamposService;
  let campoRepository: typeof Campo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CamposService,
        {
          provide: getModelToken(Campo),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CamposService>(CamposService);
    campoRepository = module.get<typeof Campo>(getModelToken(Campo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if campo already exists', async () => {
      const dto: any = { nombre: 'Test', ubicacion: 'Test Location' };
      jest.spyOn(campoRepository, 'findOne').mockResolvedValueOnce({...dto});
  

      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });

    it('should create a new campo if it does not exist', async () => {
      const dto = { nombre: 'Test', ubicacion: 'Test Location' };
      jest.spyOn(campoRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(campoRepository, 'create').mockResolvedValueOnce({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return an array of campos', async () => {
      const expectedResult: any = [{ id: 1, nombre: 'Test', ubicacion: 'Test Location' }];
      jest.spyOn(campoRepository, 'findAll').mockResolvedValueOnce(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single campo', async () => {
      const expectedResult: any = { id: 1, nombre: 'Test', ubicacion: 'Test Location' };
      jest.spyOn(campoRepository, 'findByPk').mockResolvedValueOnce(expectedResult);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a campo', async () => {
      const dto = { nombre: 'Updated Test', ubicacion: 'Updated Location' };
      jest.spyOn(campoRepository, 'update').mockResolvedValueOnce([1]);

      const result = await service.update(1, dto);

      expect(result).toEqual([1]);
    });
  });

  describe('remove', () => {
    it('should remove a campo', async () => {
      jest.spyOn(campoRepository, 'destroy').mockResolvedValueOnce(1);

      const result = await service.remove(1);

      expect(result).toEqual(1);
    });
  });
});