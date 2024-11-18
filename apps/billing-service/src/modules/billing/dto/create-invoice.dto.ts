import { PartialType } from '@nestjs/mapped-types';
import { Invoice } from '../entities/invoice.entity';


export class CreateInvoiceDto extends PartialType(Invoice) {
    readonly accountId: number;
    readonly amount: number;
    readonly dueDate: Date;
    readonly description: string;
  }