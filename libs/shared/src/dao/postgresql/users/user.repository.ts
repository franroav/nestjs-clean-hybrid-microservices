// src/infrastructure/database/user.repository.ts
import { User } from '../../../../../domain/src/entities/users/typeorm/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findById(id: any): Promise<User | null> {
    console.log("3° step", "3° step")
    return this.users.find(user => user.id === id) || null;
  }
}