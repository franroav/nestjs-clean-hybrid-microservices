import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/infrastructure/services/user.service';
import { UserRepository } from '../../src/core/interfaces/user-repository.interface';
import { User } from '../../src/core/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: 'UserRepository', useValue: {} }],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>('UserRepository');
  });

  it('should create a user', async () => {
    const user = new User('id', 'test', 'test@example.com', 'password');
    jest.spyOn(repository, 'save').mockResolvedValue(user);
    
    expect(await service.createUser('test', 'test@example.com', 'password')).toBe(user);
  });
});
