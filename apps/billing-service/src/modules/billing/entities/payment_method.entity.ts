// payment_method.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: string; // customerId should match the UUID type

  @Column({ type: 'jsonb' })
  details: any;  // Stores payment details like card information, PayPal, etc.

  @ManyToOne(() => Customer, (customer) => customer)
  customer: Customer;

  @Column({ default: true })
  isActive: boolean;
}



