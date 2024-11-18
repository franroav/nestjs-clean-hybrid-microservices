// src/core/use-cases/create-user.use-case.ts
import { User } from '@app/domain/entities/users/sequelize/user.entity';
import { UserDataAccessObject } from '@app/shared/dao/mongodb/users/user.dao';

export class CreateCampoUseCase {
  constructor(private readonly userRepository: UserDataAccessObject ) {}

  async execute(name: string, email: string): Promise<User> {
    const user = new User(Math.random().toString(), name, email);
    // await this.userRepository.save(user);
    return user;
  }
}