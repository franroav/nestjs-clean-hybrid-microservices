// transaction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';
import { PaymentMethod } from './payment_method.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice)
  invoice: Invoice;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod)
  paymentMethod: PaymentMethod;

  @Column()
  amount: number;

  @Column()
  status: string;  // e.g., pending, completed

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transactionDate: Date;
}