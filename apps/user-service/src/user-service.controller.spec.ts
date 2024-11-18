import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceController } from './user-service.controller';
import { UserService } from './user-service.service';

describe('UserServiceController', () => {
  let userServiceController: UserServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceController],
      providers: [UserService],
    }).compile();

    userServiceController = app.get<UserServiceController>(UserServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userServiceController.getHello()).toBe('Hello World!');
    });
  });
});
