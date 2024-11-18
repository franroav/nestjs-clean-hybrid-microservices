import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { getModelToken } from '@nestjs/sequelize';
import { Cliente } from './entities/cliente.entity';
import { HttpException } from '@nestjs/common';

describe('ClientesService', () => {
  let service: ClientesService;
  let clienteRepository: typeof Cliente;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: getModelToken(Cliente),
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

    service = module.get<ClientesService>(ClientesService);
    clienteRepository = module.get<typeof Cliente>(getModelToken(Cliente));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if email already exists', async () => {
      const dto: any = { nombre: 'Test', email: 'test@test.com' };
      jest.spyOn(clienteRepository, 'findOne').mockResolvedValueOnce({...dto});


      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });

    it('should create a new cliente if email does not exist', async () => {
      const dto = { nombre: 'Test', email: 'test@test.com' };
      jest.spyOn(clienteRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(clienteRepository, 'create').mockResolvedValueOnce({ id: 1, ...dto });


      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return an array of clientes', async () => {
      const expectedResult: any = [{ id: 1, nombre: 'Test', email: 'test@test.com' }];
      jest.spyOn(clienteRepository, 'findAll').mockResolvedValueOnce(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single cliente', async () => {
      const expectedResult: any = { id: 1, nombre: 'Test', email: 'test@test.com' };
      jest.spyOn(clienteRepository, 'findByPk').mockResolvedValueOnce(expectedResult);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a cliente', async () => {
      const dto = { nombre: 'Updated Test', email: 'updated@test.com' };
      jest.spyOn(clienteRepository, 'update').mockResolvedValueOnce([1]);

      const result = await service.update(1, dto);

      expect(result).toEqual([1]);
    });
  });

  describe('remove', () => {
    it('should remove a cliente', async () => {
      jest.spyOn(clienteRepository, 'destroy').mockResolvedValueOnce(1);

      const result = await service.remove(1);

      expect(result).toEqual(1);
    });
  });
});
