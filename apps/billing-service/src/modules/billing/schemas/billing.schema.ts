import { Schema, Document } from 'mongoose';

export const BillingSchema = new Schema({
  userId: { type: Number, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
});

export interface Billing extends Document {
  id: string;
  userId: number;
  amount: number;
  description: string;
  date: Date;
}