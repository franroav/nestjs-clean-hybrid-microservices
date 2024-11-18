import { Injectable } from "@nestjs/common";

import { PrismaService } from '../../../../../infrastructure/src/databases/prisma/prisma.service'

export class UserEntity {
    constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly email: string
    ) {}
  }

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: UserEntity): Promise<UserEntity> {
    return this.prismaService.user.create({ data: user });
  }
}