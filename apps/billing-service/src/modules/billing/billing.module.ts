import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";  // Ensure this import is added
import { BillingService } from "./billing.service";
import { BillingController } from "./billing.controller";
import { BillingSchema } from "./schemas/billing.schema";
import { MongoDatabaseModule } from "../../../../../libs/infrastructure/src/databases/mongoose/database.module";
import { TypeOrmDatabaseModule } from '../../../../../libs/infrastructure/src/databases/typeorm/database.module';
import { MigrationService } from '../billing/migrations/migration.service';
import { Customer } from "./entities/customer.entity";
import { Account } from "./entities/account.entity";
import { Invoice } from "./entities/invoice.entity";
import { PaymentMethod } from "./entities/payment_method.entity";
import { BillingCycle } from "./entities/billing_cycle.entity";
import { Transaction } from "./entities/transaction.entity";
import { Billing } from "./entities/billing.entity";
import { ClusteringService } from '../../../../../libs/infrastructure/src/cluster/cluster.service';
import { WorkerThreadsService } from '../../../../../libs/infrastructure/src/worker-threads/worker-threads.service';
import { ChildProcessesService } from '../../../../../libs/infrastructure/src/child-processes/child-processes.service';
import { QueuesService } from '../../../../../libs/infrastructure/src/queues/queues.service';
import { BullModule } from '@nestjs/bull';

const mongoUri = process.env.MONGODB_URI || "mongodb://root:password123@mongodb-primary:27017/"; // billing
const DatabaseSync = process.env.APP_ENV === 'production' ? false : true;

@Module({
  imports: [
    // MongoDB connection
    forwardRef(() => MongoDatabaseModule.forRoot(mongoUri)),
    MongooseModule.forFeature([{ name: "billing", schema: BillingSchema }]),

    // PostgreSQL connection for TypeORM with the required entities
    forwardRef(() => TypeOrmDatabaseModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'postgres',
      port: Number(process.env.POSTGRES_PORT) || 5432, // localhost port 5433 container port 5432
      username: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'billing',
      entities: [Billing, Customer, Account, Invoice, PaymentMethod, BillingCycle, Transaction], // Add all entities here
      synchronize: DatabaseSync,
    })),
    BullModule.registerQueue({
      name: 'taskQueue',
    }),

    // Register the required entities in TypeORM
    TypeOrmModule.forFeature([Billing, Customer, Account, Invoice, PaymentMethod, BillingCycle, Transaction]), // Add the necessary repositories
  ],
  controllers: [BillingController],
  providers: [BillingService, MigrationService, ClusteringService, WorkerThreadsService, ChildProcessesService, QueuesService  ],
  exports: [BillingService],
})
export class BillingModule {}

// MongooseModule.forRoot(`${mongoUri}`),
// MongooseModule.forFeature([{ name: 'billing', schema: BillingSchema }]),
    // TypeOrmModule.forRoot({
    //   type: "postgres",
    //   host: "localhost",
    //   port: 5433,
    //   username: "user",
    //   password: "password",
    //   database: "billing",
    //   entities: [Billing],
    //   synchronize: true,
    // }),
    // TypeOrmModule.forFeature([Billing]),