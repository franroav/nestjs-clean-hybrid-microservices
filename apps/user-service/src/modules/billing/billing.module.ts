import { Module, Logger } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BillingClientService } from './billing.service';
import { BillingController } from './billing.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make config globally available
    }),
    
    ClientsModule.registerAsync([
      {
        name: 'BILLING_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          const logger = new Logger('BillingModule');
          const broker = 'kafka1:9093,kafka2:9093,kafka3:9093'; // `${process.env.KAFKA_BROKER}` Get the broker string from the environment variable
          console.log('Kafka Broker:', broker); // Log the broker

          if (!broker) {
            logger.error('KAFKA_BROKER is not defined. Application will not start.');
            throw new Error('KAFKA_BROKER is not defined.');
          }

          // Split the broker string into an array
          const brokers = broker.split(','); // This creates an array from the comma-separated string
          logger.log(`Brokers: ${JSON.stringify(brokers)}`);
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: brokers, // Pass the brokers array
              },
              consumer: {
                groupId: configService.get<string>('KAFKA_CONSUMER_GROUP_ID') || 'billing-service-consumer-group',
              },
            },
          };
        },
      },
    ]),
    TransactionLogsModule
  ],
  controllers: [BillingController],
  providers: [BillingClientService],
  exports: [BillingClientService],
})
export class BillingModule {}


// apps\user-service\src\modules\billing\billing.module.ts
// ----------------------------------------------------------------
// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { BillingClientService } from './billing.service';
// import { BillingController } from './billing.controller';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule,
//     ClientsModule.registerAsync([
//       {
//         name: 'BILLING_SERVICE',
//         imports: [ConfigModule],
//         inject: [ConfigService],
//         useFactory: (configService: ConfigService) => ({
//           transport: Transport.TCP,
//           options: {
//             host: configService.get<string>('BILLING_SERVICE_HOST'),
//             port: configService.get<number>('BILLING_SERVICE_PORT'),
//           },
//         }),
//       },
//     ]),
//   ],
//   controllers: [BillingController],
//   providers: [BillingClientService],
//   exports: [BillingClientService],
// })
// export class BillingModule {} 