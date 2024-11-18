import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientSchema } from './models/client.model';
import { AppMicroServiceConfigModule } from '../config/config.module';
import { UnifiedDatabaseModule } from '../../../../../libs/infrastructure/src/databases/mongoose/unified-database.module';

@Module({
    imports: [
        // MongooseModule.forRoot('mongodb://localhost/client-service'),
        AppMicroServiceConfigModule ,
        UnifiedDatabaseModule.forRoot(
            'mongodb://root:password123@mongodb-primary:27017/client-service', // Your custom URI mongodb://yourUser:yourPass@yourPrincipal:yourPort,yourRead:yourPort/yourDatabaseName?replicaSet=rs0&readPreference=secondaryPreferred
            {},
          ),
        MongooseModule.forFeature([{ name: 'Client', schema: ClientSchema }]),
    ],
    controllers: [ClientController],
    providers: [ClientService],
})
export class ClientModule {}
