import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Commerce, CommerceSchema } from './models/commerce.model';
import { CommerceService } from './commerce.service';
import { CommerceController } from './commerce.controller';
import { AppMicroServiceConfigModule } from '../config/config.module';
import { UnifiedDatabaseModule } from '../../../../../libs/infrastructure/src/databases/mongoose/unified-database.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost/commerce-service'), 
    AppMicroServiceConfigModule ,
    UnifiedDatabaseModule.forRoot(
        'mongodb://root:password123@mongodb-primary:27017/commerce-service', // Your custom URI mongodb://yourUser:yourPass@yourPrincipal:yourPort,yourRead:yourPort/yourDatabaseName?replicaSet=rs0&readPreference=secondaryPreferred
        {},
      ),
    MongooseModule.forFeature([{ name: Commerce.name, schema: CommerceSchema }])],
  controllers: [CommerceController],
  providers: [CommerceService],
})
export class CommerceModule {}
