import { Module } from '@nestjs/common';
import { InfrastructureService } from './infrastructure.service';
import { ClusteringModule } from './cluster/cluster.module';

@Module({
  providers: [InfrastructureService],
  exports: [InfrastructureService],
})
export class InfrastructureModule {}


// // src/infrastructure/infrastructure.module.ts
// import { Module } from '@nestjs/common';
// import { UserRepository } from './database/user.repository';
// import { UserController } from './controllers/user.controller';
// import { CreateUserUseCase } from '../core/usecases/create-user.use-case';
// import { FindUserUseCase } from '../core/usecases/find-user.use-case';
// import { UserService } from './services/user.service';

// @Module({
//   imports: [],
//   controllers: [UserController],
//   providers: [
//     UserRepository,
//     CreateUserUseCase,
//     FindUserUseCase,
//     UserService,
//   ],
// })
// export class InfrastructureModule {}