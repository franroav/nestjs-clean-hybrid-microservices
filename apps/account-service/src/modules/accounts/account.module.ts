import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './models/account.model';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AppMicroServiceConfigModule } from '../config/config.module';
import { UnifiedDatabaseModule } from '../../../../../libs/infrastructure/src/databases/mongoose/unified-database.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost/account-service'), // Update with your MongoDB connection string
    AppMicroServiceConfigModule ,
    UnifiedDatabaseModule.forRoot(
        'mongodb://root:password123@mongodb-primary:27017/account-service', // Your custom URI mongodb://yourUser:yourPass@yourPrincipal:yourPort,yourRead:yourPort/yourDatabaseName?replicaSet=rs0&readPreference=secondaryPreferred
        {},
      ),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
