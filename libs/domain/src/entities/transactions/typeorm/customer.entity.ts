// customer.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Account } from './account.entity';

@Entity({ schema: 'billing', name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid') // Change this to 'uuid'
  id: string; // Update type to string to match UUID

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  address: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Account, (account) => account.customer) // Relationship mapping
  accounts: Account[];
}