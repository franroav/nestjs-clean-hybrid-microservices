import { Test, TestingModule } from '@nestjs/testing';
import { AgricultoresService } from './agricultores.service';
import { getModelToken } from '@nestjs/sequelize';
import { Agricultor } from './entities/agricultore.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AgricultoresService', () => {
  let service: AgricultoresService;
  let agricultorRepository: typeof Agricultor;

  const mockAgricultorRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockAgricultor = {
    id: 1,
    email: 'test@example.com',
    nombre: 'Test Agricultor',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgricultoresService,
        {
          provide: getModelToken(Agricultor),
          useValue: mockAgricultorRepository,
        },
      ],
    }).compile();

    service = module.get<AgricultoresService>(AgricultoresService);
    agricultorRepository = module.get<typeof Agricultor>(getModelToken(Agricultor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an agricultor if email does not exist', async () => {
      mockAgricultorRepository.findOne.mockResolvedValue(null);
      mockAgricultorRepository.create.mockResolvedValue(mockAgricultor);

      const result = await service.create({
        email: 'test@example.com',
        nombre: 'Test Agricultor',
      });

      expect(result).toEqual(mockAgricultor);
      expect(mockAgricultorRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockAgricultorRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        nombre: 'Test Agricultor',
      });
    });

    it('should throw an error if email already exists', async () => {
      mockAgricultorRepository.findOne.mockResolvedValue(mockAgricultor);

      await expect(service.create({
        email: 'test@example.com',
        nombre: 'Test Agricultor',
      })).rejects.toThrow(new HttpException('Email already exists for Agricultor', HttpStatus.CONFLICT));

      expect(mockAgricultorRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockAgricultorRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of agricultors', async () => {
      mockAgricultorRepository.findAll.mockResolvedValue([mockAgricultor]);

      const result = await service.findAll();
      expect(result).toEqual([mockAgricultor]);
      expect(mockAgricultorRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an agricultor by id', async () => {
      mockAgricultorRepository.findByPk.mockResolvedValue(mockAgricultor);

      const result = await service.findOne(1);
      expect(result).toEqual(mockAgricultor);
      expect(mockAgricultorRepository.findByPk).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an agricultor by id', async () => {
      mockAgricultorRepository.update.mockResolvedValue([1]);

      const result = await service.update(1, { nombre: 'Updated Agricultor' });
      expect(result).toEqual([1]);
      expect(mockAgricultorRepository.update).toHaveBeenCalledWith({ nombre: 'Updated Agricultor' }, { where: { id: 1 } });
    });
  });

  describe('remove', () => {
    it('should remove an agricultor by id', async () => {
      mockAgricultorRepository.destroy.mockResolvedValue(1);

      const result = await service.remove(1);
      expect(result).toEqual(1);
      expect(mockAgricultorRepository.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});

