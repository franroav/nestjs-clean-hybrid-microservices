import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CreateUserUseCase } from '@app/application/usecases/users/create-user.use-case';
import { FindUserUseCase } from '@app/application/usecases/users/find-user.use-case';
// import { UserRepository } from "@app/application/interfaces/users/user-repository.interface";
import { UserDataAccessObject } from '@app/shared/dao/mongodb/users/user.dao'

import { AppConfigModule } from "@app/shared/config/app/config.module";
import { JwtService } from '@nestjs/jwt';
import { MicroservicesModule } from "./microservices.module";


@Module({
  imports: [
    AppConfigModule, // Add AppConfigModule to imports
    MicroservicesModule, // Importing the refactored microservices module
  ],
  controllers: [UserController],
  providers: [UserService, CreateUserUseCase, FindUserUseCase, UserDataAccessObject,  JwtService],
  exports: [UserDataAccessObject], // Export UserRepository if needed in other modules
})
export class UserModule {}





// import { Module } from "@nestjs/common";
// import { UploadController } from "./user-service.controller";
// import { UserService } from "./user-service.service";
// import { ClientsModule, Transport } from "@nestjs/microservices";

// import { AgricultoresModule } from './modules/agricultores/agricultores.module';
// import { ClientesModule } from './modules/clientes/clientes.module';
// import { VariedadesService } from "./modules/variedades/variedades.service";
// import { FrutasService } from "./modules/frutas/frutas.service";
// import { CamposService } from "./modules/campos/campos.service";
// import { VariedadesModule } from "./modules/variedades/variedades.module";
// import { FrutasModule } from "./modules/frutas/frutas.module";
// import { CamposModule } from "./modules/campos/campos.module";
// import { ClientesService } from "./modules/clientes/clientes.service";

// @Module({
//   imports: [
//     AgricultoresModule,
//     ClientesModule,
//     VariedadesModule,
//     FrutasModule,
//     CamposModule,
//     ClientsModule.register([
//       {
//         name: "MAIL_SERVICE",
//         transport: Transport.TCP,
//         options: { port: 3003 },
//       },
//       {
//         name: "USER_SERVICE",
//         transport: Transport.TCP,
//         options: { port: 3002 },
//       },
//     ]),
//   ],
//   controllers: [UploadController],
//   providers: [UserService, VariedadesService, ClientesService, FrutasService, CamposService],
// })
// export class UserServiceModule {}


