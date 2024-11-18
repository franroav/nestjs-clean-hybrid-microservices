import { Test, TestingModule } from '@nestjs/testing';
import { FrutasService } from './frutas.service';
import { getModelToken } from '@nestjs/sequelize';
import { Fruta } from './entities/fruta.entity';
import { HttpException } from '@nestjs/common';

describe('FrutasService', () => {
  let service: FrutasService;
  let frutaRepository: typeof Fruta;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FrutasService,
        {
          provide: getModelToken(Fruta),
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

    service = module.get<FrutasService>(FrutasService);
    frutaRepository = module.get<typeof Fruta>(getModelToken(Fruta));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if the fruta name already exists', async () => {
      const dto: any = { nombre: 'Apple' };
      jest.spyOn(frutaRepository, 'findOne').mockResolvedValueOnce({...dto});


      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });

    it('should create a new fruta if the name does not exist', async () => {
      jest.spyOn(frutaRepository, 'findOne').mockResolvedValueOnce(null);
      const dto = { nombre: 'Apple' };
      jest.spyOn(frutaRepository, 'create').mockResolvedValueOnce({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return an array of frutas', async () => {
      const expectedResult: any = [{ id: 1, nombre: 'Apple' }];
      jest.spyOn(frutaRepository, 'findAll').mockResolvedValueOnce(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single fruta', async () => {
      const expectedResult: any = { id: 1, nombre: 'Apple' };
      jest.spyOn(frutaRepository, 'findByPk').mockResolvedValueOnce(expectedResult);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a fruta', async () => {
      const dto = { nombre: 'Updated Apple' };
      jest.spyOn(frutaRepository, 'update').mockResolvedValueOnce([1]);

      const result = await service.update(1, dto);

      expect(result).toEqual([1]);
    });
  });

  describe('remove', () => {
    it('should remove a fruta', async () => {
      jest.spyOn(frutaRepository, 'destroy').mockResolvedValueOnce(1);

      const result = await service.remove(1);

      expect(result).toEqual(1);
    });
  });
});
