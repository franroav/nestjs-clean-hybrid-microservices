import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
// import { SequelizeModule } from "@nestjs/sequelize";
import { CacheModule } from "@nestjs/cache-manager";
import { LoggerModule } from "nestjs-pino";
import { CsvModule } from "nest-csv-parser";
import { MulterModule } from "@nestjs/platform-express";
import { CustomCacheInterceptor } from "../../../libs/shared/src/interceptors/cache.interceptor";
// import { GlobalExceptionsFilters } from "../../../libs/shared/src/filters/global-exception.filter";
// import { dataBaseConfig } from "../../../libs/infrastructure/src/databases/sequelize/database.config";
import { TransactionLogsModule } from "./modules/transaction-logs/transaction-logs.module";
import { PrometheusModule } from "./modules/prometheus/prometheus.module";
import { AppMicroServiceConfigModule } from './modules/config/config.module'
// import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppConfigModule } from "../../../libs/shared/src/config/app/config.module";
import { AppConfigService } from "../../../libs/shared/src/config/app/configuration.service";
import { AuthModule } from "./modules/auth/auth.module";
// import { UserDataAccessObject } from "@app/shared/dao/mongodb/users/user.dao";
// import { ClientModule } from './modules/clients/client.module'

const broker = 'kafka1:9093,kafka2:9093,kafka3:9093'; // `${process.env.KAFKA_BROKER}` Get the broker string from the environment variable
const brokers = broker.split(','); // This creates an array from the comma-separated string


@Module({
  imports: [
    //Business Transversal Microservices modules available for all modules
    // ClientsModule.register([
    //   {
    //     name: "MAIL_SERVICE",
    //     transport: Transport.TCP,
    //     options: {
    //       host: "nestjs-clean-code-architecture-email-service-1", // Use the Docker Compose service name
    //       port: 3003,
    //     },
    //   },
    //   {
    //     name: "USER_SERVICE",
    //     transport: Transport.TCP,
    //     options: { port: 4001 },
    //   },
    //   {
    //     name: "CACHE_SERVICE",
    //     transport: Transport.REDIS,
    //     options: {
    //       // url: "redis://localhost:6379",
    //       port: 3002,
    //     },
    //   },
    //   {
    //     name: "BILLING_SERVICE",
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         brokers: brokers, // Example broker setup
    //         retry: {
    //           retries: 5, // Increase retry count for stability
    //         },
    //       },
    //       consumer: {
    //         groupId: "bank-service-consumer-group", // Use a different groupId for user-service
    //       },
    //     },
    //   },
    // ]),
    // LOCAL - CONFIGURATION ./apps/{microservice}/.env OF MICROSERVICE ENVIROMENT
    AppMicroServiceConfigModule,
    // GLOBAL - CONFIGURATION ./.env OF NESTJS MICROSERVICE ENVIROMENT 
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
    // SequelizeModule.forRoot(dataBaseConfig),
    CacheModule.register({
      ttl: 10, // Cache TTL in seconds
      max: 100, // Max cache items
    }),
    CsvModule,
    MulterModule,
    TransactionLogsModule, // Ensure TransactionLogsModule is imported
    PrometheusModule,
    AuthModule,
    // ClientModule,
  ],
  providers: [
    // UserDataAccessObject,
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