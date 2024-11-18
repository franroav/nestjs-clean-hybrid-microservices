import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";


const broker = 'kafka1:9093,kafka2:9093,kafka3:9093'; // `${process.env.KAFKA_BROKER}` Get the broker string from the environment variable
const brokers = broker.split(','); // This creates an array from the comma-separated string

@Module({
  imports: [
    //Business Specific Microservices modules available for the module in specific.
    ClientsModule.register([
      {
        name: "MAIL_SERVICE",
        transport: Transport.TCP,
        options: {
          host: 'nestjs-clean-code-architecture-email-service-1', // Use the Docker Compose service name
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
  ],
  exports: [ClientsModule],
})
export class MicroservicesModule {}
