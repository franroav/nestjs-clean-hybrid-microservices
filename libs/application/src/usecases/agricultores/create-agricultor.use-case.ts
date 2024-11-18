// src/core/use-cases/create-user.use-case.ts
import { Agricultor } from '@app/domain/entities/agricultores/sequelize/agricultore.entity';
import { UserDataAccessObject } from '@app/shared/dao/mongodb/users/user.dao';

export class CreateAgricultorUseCase {
  constructor(private readonly userRepository: UserDataAccessObject) {}

  async execute(name: string, email: string): Promise<Agricultor> {
    const user = new Agricultor();
    // await this.userRepository.save(user);
    return user;
  }
}