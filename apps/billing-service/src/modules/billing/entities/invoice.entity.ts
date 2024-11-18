import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Account } from "./account.entity";

@Entity({ schema: "billing", name: "invoices" })
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  invoice_number: string;

  @Column()
  account_id: number;

  //   @ManyToOne(() => Account, (account) => account.invoices, { onDelete: 'CASCADE' })
  @ManyToOne(() => Account, (account) => account, { onDelete: "CASCADE" })
  account: Account;

  @Column()
  billing_cycle_id: number;

  @Column("date")
  issue_date: string;

  @Column("date")
  due_date: string;

  @Column("decimal", { precision: 10, scale: 2 })
  total_amount: number;

  @Column({ length: 20, default: "unpaid" })
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
