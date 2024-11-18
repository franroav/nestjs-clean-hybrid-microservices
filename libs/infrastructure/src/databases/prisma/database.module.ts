import { Module, DynamicModule } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Module({})
export class PrismaDatabaseModule {
  static forRoot(): DynamicModule {
    const prisma = new PrismaClient();
    return {
      module: PrismaDatabaseModule,
      providers: [
        {
          provide: PrismaClient,
          useValue: prisma,
        },
      ],
      exports: [PrismaClient],
    };
  }
}