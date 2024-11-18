import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { CacheModule } from "@nestjs/cache-manager";
import { LoggerModule } from "nestjs-pino";
import { CsvModule } from "nest-csv-parser";
import { MulterModule } from "@nestjs/platform-express";
import { CustomCacheInterceptor } from "../../../libs/shared/src/interceptors/cache.interceptor";
import { GlobalExceptionsFilters } from "../../../libs/shared/src/filters/global-exception.filter";
import { dataBaseConfig } from "../../../libs/infrastructure/src/databases/sequelize/database.config";

import { FrutasModule } from "./modules/frutas/frutas.module";
import { VariedadesModule } from "./modules/variedades/variedades.module";
import { CosechasModule } from "./modules/cosechas/cosechas.module";
import { AgricultoresModule } from "./modules/agricultores/agricultores.module";
import { ClientesModule } from "./modules/clientes/clientes.module";
import { CamposModule } from "./modules/campos/campos.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TransactionLogsModule } from "./modules/transaction-logs/transaction-logs.module";
import { PrometheusModule } from "./modules/prometheus/prometheus.module";
// import { UserServiceModule } from "./user-service.module";
import { UserModule } from "./modules/users/user.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppConfigModule } from "../../../libs/shared/src/config/app/config.module";
import { AppConfigService } from "../../../libs/shared/src/config/app/configuration.service";
import { UserDataAccessObject } from "@app/shared/dao/mongodb/users/user.dao";
import { BillingModule } from "./modules/billing/billing.module";

const broker = 'kafka1:9093,kafka2:9093,kafka3:9093'; // `${process.env.KAFKA_BROKER}` Get the broker string from the environment variable
const brokers = broker.split(','); // This creates an array from the comma-separated string


@Module({
  imports: [
    //Business Transversal Microservices modules available for all modules
    ClientsModule.register([
      {
        name: "MAIL_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "nestjs-clean-code-architecture-email-service-1", // Use the Docker Compose service name
          port: 3003,
        },
      },
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: { port: 4001 },
      },
      {
        name: "CACHE_SERVICE",
        transport: Transport.REDIS,
        options: {
          // url: "redis://localhost:6379",
          port: 3002,
        },
      },
      {
        name: "BILLING_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: brokers, // Example broker setup
            retry: {
              retries: 5, // Increase retry count for stability
            },
          },
          consumer: {
            groupId: "user-service-consumer-group", // Use a different groupId for user-service
          },
        },
      },
    ]),
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
      inject: [AppConfigService],
    }),
    LoggerModule.forRoot(),
    SequelizeModule.forRoot(dataBaseConfig),
    CacheModule.register({
      ttl: 10, // Cache TTL in seconds
      max: 100, // Max cache items
    }),
    CsvModule,
    MulterModule,
    FrutasModule,
    VariedadesModule,
    CosechasModule,
    AgricultoresModule,
    CamposModule,
    ClientesModule,
    TransactionLogsModule, // Ensure TransactionLogsModule is imported
    PrometheusModule,
    AuthModule,
    UserModule,
    BillingModule,
    // UserServiceModule
  ],
  providers: [
    UserDataAccessObject,
    AppConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor,
    },
    // {
    //   provide: APP_FILTER,
    //   useFactory: (httpAdapterHost: HttpAdapterHost) => new GlobalExceptionsFilters(httpAdapterHost),
    //   inject: [HttpAdapterHost],
    // },
  ],
  exports: [AppConfigService],
})
export class AppModule {}

// import { Module, Bind, Body, Catch, BadGatewayException, MiddlewareConsumer, NestModule, RequestMethod, } from "@nestjs/common";
// import { APP_FILTER, APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
// import { UploadController } from './user-service.controller';
// import { UserService } from './user-service.service';
// import { AppConfigService } from '../../../libs/shared/src/config/app/configuration.service';
// import { CustomCacheInterceptor } from '../../../libs/shared/src/interceptors/cache.interceptor';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { GlobalExceptionsFilters } from '../../../libs/shared/src/filters/global-exception.filter';
// import { JwtModule } from '@nestjs/jwt';
// import { TokenGuard } from '../../../libs/shared/src/guards/token.guard'; // Import your TokenGuard class

// import { UserServiceModule } from './user-service.module'
// import { FrutasModule } from './modules/frutas/frutas.module';
// import { CosechasModule } from './modules/cosechas/cosechas.module';
// import { AgricultoresModule } from './modules/agricultores/agricultores.module';
// import { ClientesModule } from './modules/clientes/clientes.module';
// import { dataBaseConfig } from '../../../libs/infrastructure/src/databases/sequelize/database.config';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { VariedadesModule } from './modules/variedades/variedades.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { PrometheusModule } from './modules/prometheus/prometheus.module';
// import { CamposModule } from './modules/campos/campos.module';
// import { LoggerModule } from 'nestjs-pino';
// import { CsvModule } from 'nest-csv-parser';
// import { MulterModule } from '@nestjs/platform-express';
// import { TransactionLogsModule } from './modules/transaction-logs/transaction-logs.module';
// import { AppConfigModule } from '../../../libs/shared/src/config/app/config.module';
// import { CacheModule } from '@nestjs/cache-manager';
// // import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware'; // Import correlation Middleware

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true, // This makes ConfigModule available globally
//     }),  // Load .env file
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'),
//         signOptions: { expiresIn: '1h' },
//       }),
//       inject: [ConfigService],
//     }),
//     AppConfigModule,
//     LoggerModule.forRoot(),
//     FrutasModule,
//     VariedadesModule,
//     CosechasModule,
//     AgricultoresModule,
//     CamposModule,
//     ClientesModule,
//     SequelizeModule.forRoot(dataBaseConfig),
//     CsvModule,
//     MulterModule,
//     PrometheusModule,
//     TransactionLogsModule,
//     CacheModule.register({
//       ttl: 5, // seconds
//       max: 10, // maximum number of items in cache
//     }),
//     AuthModule,
//     UserServiceModule
//   ],
//   // controllers: [ UploadController],
//   providers: [

//     AppConfigService,
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: CustomCacheInterceptor,
//     },
//     {
//       provide: APP_FILTER,
//       useFactory: (httpAdapterHost: HttpAdapterHost) => {
//         //return new GlobalExceptionsFilters(httpAdapterHost);
//         return new GlobalExceptionsFilters();
//       },
//       inject: [HttpAdapterHost],
//     },
//     TokenGuard,
//   ],
//   exports: [AppConfigService],
//   controllers: [ ],
//   // providers: [],
//   // exports: [],
// })
// export class AppModule {}
