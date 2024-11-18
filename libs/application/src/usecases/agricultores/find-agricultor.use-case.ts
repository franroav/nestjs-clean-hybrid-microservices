// src/core/use-cases/find-user.use-case.ts
import { User } from '@app/domain/entities/users/sequelize/user.entity';
import { UserRepository } from '@app/shared/dao/postgresql/users/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: any): Promise<User | null> {
    console.log("2° step", "2° step")
    return await this.userRepository.findById(id);
  }
}