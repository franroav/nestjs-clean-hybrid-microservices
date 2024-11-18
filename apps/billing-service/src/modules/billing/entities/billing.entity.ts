import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @Entity('billing')
@Entity({ schema: 'billing', name: 'billing' })
export class Billing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  // Optionally, initialize fields in the constructor if needed:
  constructor() {
    this.id = '';
    this.userId = 0;
    this.amount = 0.0;
    this.description = '';
    this.date = new Date();
  }
}