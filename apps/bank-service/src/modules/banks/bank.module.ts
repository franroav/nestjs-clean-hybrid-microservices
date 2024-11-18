// apps/bank-service/src/bank.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from '@libs/shared/src/models/bank.model';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { BankDao } from '@libs/shared/src/dao/mongodb/payment/bank.dao';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }])
    ],
    controllers: [BankController],
    providers: [BankService, BankDao],
})
export class BankModule {}
