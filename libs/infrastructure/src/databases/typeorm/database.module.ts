// libs/infrastructure/src/databases/typeorm/database.module.ts

import { Module, DynamicModule, Type } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({})
export class TypeOrmDatabaseModule {
  static forRoot(options: TypeOrmModuleOptions): DynamicModule {
    return {
      module: TypeOrmDatabaseModule,
      // imports: [TypeOrmModule.forRoot(options)],
      imports: [TypeOrmModule.forRoot({
        ...options,
        extra: {
          max: 10, // Maximum number of connections in the pool
          idleTimeoutMillis: 30000, // 30 seconds before idle connection is closed
        },
      })],
    };
  }

  static forFeature(entities: Type<any>[]): DynamicModule {
    return {
      module: TypeOrmDatabaseModule,
      imports: [TypeOrmModule.forFeature(entities)],
    };
  }
}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '@my-org/domain'; // Adjust the import according to your setup

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       entities: [User],
//       synchronize: true,
//     }),
//   ],
// })
// export class DatabaseModule {}




// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../../core/entities/user.entity';
// import { UserRepository } from './user.repository';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: parseInt(process.env.DB_PORT, 10),
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       entities: [User],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([User]),
//   ],
//   providers: [UserRepository],
//   exports: [UserRepository],
// })
// export class DatabaseModule {}




// // 2. Dynamic Modules: Configurable modules that change behavior based on external options
// // Dynamic modules allow you to configure modules dynamically during runtime, often based on external configuration values or services.
// // apps/user-service/src/infrastructure/database/database.module.ts
// import { DynamicModule, Module } from '@nestjs/common';
// import { DatabaseOptions } from '../../core/interfaces/database-options.interface';

// @Module({})
// export class DatabaseModule {
//   static register(options: DatabaseOptions): DynamicModule {
//     return {
//       module: DatabaseModule,
//       providers: [
//         {
//           provide: 'DATABASE_OPTIONS',
//           useValue: options,
//         },
//       ],
//       exports: ['DATABASE_OPTIONS'], // Export if other modules need access
//     };
//   }
// }