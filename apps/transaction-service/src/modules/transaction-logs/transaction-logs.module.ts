import { Module } from '@nestjs/common';
import { TransactionLogsService } from './services/transaction-logs.service';
import { v4 as uuidv4 } from "uuid";

@Module({
  providers: [
    TransactionLogsService,
    {
      provide: 'UUID_GENERATOR',
      useValue: uuidv4,  // Ensure correct syntax without parentheses to use the function reference
    },
  ],
  exports: [TransactionLogsService, 'UUID_GENERATOR'],  // Export UUID_GENERATOR as well if it’s needed elsewhere
})
export class TransactionLogsModule {}
