import { NestFactory } from '@nestjs/core';
import { EmailServiceModule } from './email-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(MailappModule);
  // await app.listen(3000);

  const app = await NestFactory.create(EmailServiceModule);
  // Microservice #1: TCP Transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3003,
    },
  });

  // Start all microservices
  await app.startAllMicroservices();
}
bootstrap();


// Update the EmailServiceModule to bind to 0.0.0.0:
//  Ensure that the email-service microservice is listening on all network
//  interfaces (0.0.0.0) instead of 127.0.0.1, so it's accessible by other 
// services in the Docker network.