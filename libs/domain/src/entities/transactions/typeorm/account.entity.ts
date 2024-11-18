// account.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('accounts') // Specify table name
export class Account {
  @PrimaryGeneratedColumn('uuid') // Use 'uuid' for UUID primary keys
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.accounts, { eager: true })
  @JoinColumn({ name: 'customerId' }) // Explicitly define the customerId column
  customer: Customer;

  @Column({ type: 'varchar', length: 20, unique: true })
  accountNumber: string;

  @Column({ type: 'varchar', length: 50 })
  accountType: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  balance: number;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'uuid' }) // Explicitly add customerId as a column
  customerId: string;
}