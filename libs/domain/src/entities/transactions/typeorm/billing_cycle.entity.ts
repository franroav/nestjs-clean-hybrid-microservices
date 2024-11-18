// billing_cycle.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BillingCycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cycleName: string;  // e.g., Monthly, Quarterly

  @Column()
  duration: number;  // Number of days for the cycle
}