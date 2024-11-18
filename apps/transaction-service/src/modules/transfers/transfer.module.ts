import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransferService } from './transfer.service';
import { Transfer, TransferSchema } from './schemas/transfer.model';
import { Order, OrderSchema } from './schemas/order.model';
import { Account, AccountSchema } from './schemas/account.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transfer.name, schema: TransferSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  providers: [TransferService],
  exports: [TransferService],
})
export class TransferModule {}
