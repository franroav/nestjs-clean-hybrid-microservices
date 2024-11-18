import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { HttpStatus, VersioningType } from "@nestjs/common";
import helmet from 'helmet';
import { ValidationPipe } from '../../../libs/shared/src/pipes/class-validator/validation.pipe';
import { GlobalExceptionsFilters } from '../../../libs/shared/src/filters/global-exception.filter';
import { AppConfigService } from '../../../libs/shared/src/config/app/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(AppConfigService);

  // Security middlewares
  app.use(helmet());

  // Configure versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Configure logger
  app.useLogger(app.get(Logger));

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors();

  // Swagger setup
  if (appConfig.activarSwagger) {
    const options = new DocumentBuilder()
      .setTitle('ApiGateway Microservice')
      .setDescription('Microservices proxy API')
      .setVersion('1.0')
      .addTag('api-gateway')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  // Apply global DTO validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Apply global exception filters
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionsFilters());

  // Configure microservice options for TCP transport for other services
  const microservices = [
    { name: 'user-service', port: 3001 },
    { name: 'email-service', port: 3000 },
    { name: 'client-service', port: 3012 },
    { name: 'card-service', port: 3004 },
    { name: 'bank-service', port: 3013 },
    { name: 'notification-service', port: 3006 },
    { name: 'order-service', port: 3007 },
    { name: 'payment-service', port: 3008 },
    { name: 'customer-service', port: 3010 },
    { name: 'delivery-service', port: 3005 },
    { name: 'account-service', port: 3011 },
    { name: 'risk-service', port: 3009 },
    { name: 'transaction-service', port: 3012 }
  ];

  // Create and start each microservice with TCP transport
  microservices.forEach(service => {
    const microservice = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: { port: service.port },
    });
    microservice.listen();  // Correctly call listen without arguments
    console.log(`${service.name} is listening on port ${service.port}`);
  });

  // Configure billing-service to use Kafka transport
  const billingService = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // Replace with your Kafka broker addresses
        clientId: 'billing-service-client',
      },
      consumer: {
        groupId: 'billing-service-group', // Unique group ID for the consumer
      },
    },
  });

  billingService.listen();  // Correctly call listen without arguments
  console.log('billing-service is listening via Kafka transport');

  // Start the main API gateway app on its own port
  await app.listen(9001);
  console.log('API Gateway is listening on port 9001');
}

bootstrap();
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(9001);
// }
// bootstrap();
