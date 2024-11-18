import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { App, AppSchema } from './models/app.model';
import { AppMicroServiceConfigModule } from '../config/config.module';
// import { MongoDatabaseModule } from '../../../../../libs/infrastructure/src/databases/mongoose/database.module'; // Path to shared database module
import { UnifiedDatabaseModule } from '../../../../../libs/infrastructure/src/databases/mongoose/unified-database.module'; // Path to shared database module



@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost/apps-service'),
    AppMicroServiceConfigModule ,
    UnifiedDatabaseModule.forRoot(
        'mongodb://root:password123@mongodb-primary:27017/apps-service', // Your custom URI mongodb://yourUser:yourPass@yourPrincipal:yourPort,yourRead:yourPort/yourDatabaseName?replicaSet=rs0&readPreference=secondaryPreferred
        {},
      ),
     MongooseModule.forFeature([{ name: App.name, schema: AppSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppsModule {}