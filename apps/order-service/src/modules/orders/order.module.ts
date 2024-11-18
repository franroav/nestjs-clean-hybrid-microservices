// apps/order-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDao } from './dao/order.dao';
import { OrderModel } from './models/order.model';
import { AppMicroServiceConfigModule } from '../config/config.module';
import { UnifiedDatabaseModule } from '../../../../../libs/infrastructure/src/databases/mongoose/unified-database.module';

@Module({
    imports: [
        // MongooseModule.forRoot('mongodb://localhost/order-service'), // Update connection string
        AppMicroServiceConfigModule ,
        UnifiedDatabaseModule.forRoot(
            'mongodb://root:password123@mongodb-primary:27017/order-service', // Your custom URI mongodb://yourUser:yourPass@yourPrincipal:yourPort,yourRead:yourPort/yourDatabaseName?replicaSet=rs0&readPreference=secondaryPreferred
            {},
          ),
        MongooseModule.forFeature([{ name: 'Order', schema: OrderModel.schema }]),
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderDao],
})
export class OrderModule {}
