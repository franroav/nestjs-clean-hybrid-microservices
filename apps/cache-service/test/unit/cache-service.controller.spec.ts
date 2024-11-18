import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/infrastructure/services/user.service';
import { UserController } from '../../src/infrastructure/controllers/user.controller';
import { UserRepository } from '../../src/core/interfaces/user-repository.interface';
import { beforeEach, describe, it,  } from 'node:test';


describe('UserServiceController', () => {
  let userService: UserService;
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: 'UserRepository', // Mock the repository
          useClass: UserRepository,  // Replace with a mock class or jest.fn() for unit tests
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  // Add more tests here
});
