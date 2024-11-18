import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { Kafka, logLevel, Partitioners } from 'kafkajs';

async function bootstrap() {
  const broker = 'kafka1:9093,kafka2:9093,kafka3:9093'; // Environment variable for Kafka broker(s)
  const brokers = broker.split(',');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers, // Pass the brokers array
          retry: {
            retries: 5,
          },
        },
        consumer: {
          groupId: 'billing-consumer',
          sessionTimeout: 30000, // Leader election timeout
        },
      },
    }
  );

  // Set up a Kafka client and producer manually
  const kafka = new Kafka({
    clientId: 'billing-service',
    brokers, // Kafka brokers
    logLevel: logLevel.DEBUG, // This will give you detailed logs
    // info: logLevel.INFO,
  });

  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner, // Custom partitioner
  });

  // Connect the producer
  await producer.connect();
  console.log("Kafka producer connected");

  // Example: Sending a message using the producer
  await producer.send({
    topic: 'billing-events',
    messages: [
      { value: 'Test message from billing service' },
    ],
  });

  // Listen for incoming messages (handled by your NestJS microservice)
  await app.listen();
  console.log('Billing service microservice is listening');
}

bootstrap();

