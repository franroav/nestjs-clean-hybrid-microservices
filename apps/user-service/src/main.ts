
/** MICROSERVICESS */
// Transport Types:
// Transport.TCP: For TCP-based communication.
// Transport.REDIS: For Redis-based communication.
// Transport.NATS: For NATS-based communication.
// Transport.KAFKA: For Kafka-based communication.
// Transport.GRPC: For gRPC-based communication.
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from "@nestjs/platform-fastify";

import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Sequelize } from "sequelize-typescript";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { seedDatabase } from "../../../libs/shared/src/utils/seed";
import { CustomHttpException } from "../../../libs/shared/src/filters/custom-http.exception";
import { HttpStatus, VersioningType } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { AppConfigService } from "../../../libs/shared/src/config/app/configuration.service";
import { ValidationPipe } from "../../../libs/shared/src/pipes/class-validator/validation.pipe";
import { GlobalExceptionsFilters } from "../../../libs/shared/src/filters/global-exception.filter";
import {
  ClientProxyFactory,
  MicroserviceOptions,
  Transport,
} from "@nestjs/microservices";
import helmet from "helmet";

async function bootstrap() {
  // Create the NestJS application
  // const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter()); // Fastify
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);
  // Security middlewares
  app.use(helmet());
  // Register middlewares
  // app.use(new CorrelationIdMiddleware().use);
  // Configure versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // Configure logger
  app.useLogger(app.get(Logger));
  // Set global prefix
  app.setGlobalPrefix("api");
  // Enable CORS
  app.enableCors();
  // Swagger setup
  console.log("SWAGGER_CONFIG", appConfig.activarSwagger)
  if (appConfig.activarSwagger) {
    const options = new DocumentBuilder()
      .setTitle("User Service Micro-Service")
      .setDescription("User service API")
      .setVersion("1.0")
      .addTag("user-service")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("swagger", app, document);
  }

  // Seed database if needed
  if (appConfig.appActiveDatabase) {
    const sequelize = app.get(Sequelize);
    try {
      await seedDatabase(sequelize);
    } catch (error) {
      throw new CustomHttpException(
        `Error de base de datos: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "server error"
      );
    }
  }

  // Apply global DTO validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Apply global exception filters
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionsFilters());

  // app.useGlobalFilters(new GlobalExceptionsFilters(httpAdapterHost));

  // Set up microservice if needed

  // Microservice #1: TCP Transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 4001, // Port for the TCP microservice
    },
  });

  // Start all microservices
  await app.startAllMicroservices();

  await app.listen(3001);


}
bootstrap();

  // const microserviceApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     host: '127.0.0.1' || 'localhost',
  //     port: 3001,
  //   },
  // });

  //  // Configure client proxy for microservices communication
  //  const client = ClientProxyFactory.create({
  //   transport: Transport.TCP,
  //   options: {
  //     host: '127.0.0.1',
  //     port: 3001,
  //   },
  // });

  // // Listen to microservice
  // microserviceApp.listen();

  // // Start HTTP server
  // await app.listen(3001 || appConfig.appPort);