// Purpose: Validates transaction details before processing, ensuring that only valid transactions proceed.

import { BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from '@app/application/dto/transactions/create-transactions.dto';

export function ValidateTransaction() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: CreateTransactionDto[]) {
      const transaction = args[0];
      if (!transaction.amount || transaction.amount <= 0) {
        throw new BadRequestException('Invalid transaction amount');
      }
      // Additional validation rules can be added here
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}