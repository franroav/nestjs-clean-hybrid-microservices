// src/core/use-cases/create-user.use-case.ts
import { User } from "@app/domain/entities/users/sequelize/user.entity";
import { UserDataAccessObject } from "@app/shared/dao/mongodb/users/user.dao";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserDataAccessObject) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    const user = new User(Math.random().toString(), name, email, password);
    console.log("user", user);
    console.log(this.userRepository); // This should log the repository instance

    // Check if the userRepository is undefined here
    if (!this.userRepository) {
      console.error("UserRepository is undefined!");
      throw new Error("UserRepository dependency is not injected");
    }

    await this.userRepository.save(user);
    return user;
  }
}
