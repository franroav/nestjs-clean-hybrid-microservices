import { Test, TestingModule } from '@nestjs/testing';
import { VariedadesService } from './variedades.service';
import { getModelToken } from '@nestjs/sequelize';
import { Variedad } from './entities/variedade.entity';
import { HttpException } from '@nestjs/common';

describe('VariedadesService', () => {
  let service: VariedadesService;
  let variedadeRepository: typeof Variedad;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariedadesService,
        {
          provide: getModelToken(Variedad),
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

    service = module.get<VariedadesService>(VariedadesService);
    variedadeRepository = module.get<typeof Variedad>(getModelToken(Variedad));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if the variedad name already exists', async () => {
      const dto: any = { nombre: 'Golden Delicious' };
      jest.spyOn(variedadeRepository, 'findOne').mockResolvedValueOnce({...dto});


      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });

    it('should create a new variedad if the name does not exist', async () => {
      jest.spyOn(variedadeRepository, 'findOne').mockResolvedValueOnce(null);
      const dto = { nombre: 'Golden Delicious' };
      jest.spyOn(variedadeRepository, 'create').mockResolvedValueOnce({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return an array of variedades', async () => {
      const expectedResult: any = [{ id: 1, nombre: 'Golden Delicious' }];
      jest.spyOn(variedadeRepository, 'findAll').mockResolvedValueOnce(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single variedad', async () => {
      const expectedResult: any = { id: 1, nombre: 'Golden Delicious' };
      jest.spyOn(variedadeRepository, 'findByPk').mockResolvedValueOnce(expectedResult);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a variedad', async () => {
      const dto = { nombre: 'Updated Golden Delicious' };
      jest.spyOn(variedadeRepository, 'update').mockResolvedValueOnce([1]);

      const result = await service.update(1, dto);

      expect(result).toEqual([1]);
    });
  });

  describe('remove', () => {
    it('should remove a variedad', async () => {
      jest.spyOn(variedadeRepository, 'destroy').mockResolvedValueOnce(1);

      const result = await service.remove(1);

      expect(result).toEqual(1);
    });
  });
});