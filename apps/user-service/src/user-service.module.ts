import { Module } from "@nestjs/common";
import { UploadController } from "./user-service.controller";
import { UserService } from "./user-service.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { AgricultoresModule } from './modules/agricultores/agricultores.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { VariedadesService } from "./modules/variedades/variedades.service";
import { FrutasService } from "./modules/frutas/frutas.service";
import { CamposService } from "./modules/campos/campos.service";
import { VariedadesModule } from "./modules/variedades/variedades.module";  // Import VariedadesModule
import { FrutasModule } from "./modules/frutas/frutas.module";
import { CamposModule } from "./modules/campos/campos.module";
import { ClientesService } from "./modules/clientes/clientes.service";

@Module({
  imports: [
    AgricultoresModule,
    ClientesModule,
    VariedadesModule,  // Import VariedadesModule here
    FrutasModule,
    CamposModule,
    ClientsModule.register([
      {
        name: "MAIL_SERVICE",
        transport: Transport.TCP,
        options: { port: 3003 },
      },
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: { port: 4001 },
      },
    ]),
  ],
  controllers: [UploadController],
  providers: [UserService, VariedadesService, ClientesService, FrutasService, CamposService],
})
export class UserServiceModule {}





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


