// src/core/use-cases/find-user.use-case.ts
import { User } from '@app/domain/entities/users/sequelize/user.entity';
import { UserDataAccessObject } from '@app/shared/dao/mongodb/users/user.dao'
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly userRepository: UserDataAccessObject) {}

  async execute(email: any): Promise<User | null> {
    console.log("2° step", "2° step")
    return await this.userRepository.findByEmail(email);
  }
}