
import { PartialType } from '@nestjs/mapped-types';
import { Transaction } from '../entities/transaction.entity';



export class CreateTransactionDto extends PartialType(Transaction) {
    readonly invoiceId: number;  // Reference to the invoice related to this transaction
    readonly paymentMethodId: number;  // Payment method used for this transaction
    readonly amount: number;  // Amount of the transaction
    readonly status: string;  // Status of the transaction, e.g., 'pending', 'completed', 'failed'
    readonly transactionDate: Date;
    readonly details: Record<string, any>;  // JSONB field for any additional transaction details
  }