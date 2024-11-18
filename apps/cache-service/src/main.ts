import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // Microservice #1: TCP Transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      port: 6379, // Port for the TCP microservice
      host: process.env.REDIS_HOST || 'redis', // Default to localhost for local development
    },
  });

  // Start all microservices
  await app.startAllMicroservices();
  
}
bootstrap();

