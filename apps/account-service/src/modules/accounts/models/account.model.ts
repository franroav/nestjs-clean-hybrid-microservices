import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  accountTitular: string;

  @Prop({ required: true })
  accountDni: string;

  @Prop({ required: true })
  accountType: string;

  @Prop({ default: false })
  isDelete: boolean;

  @Prop({ type: Date })
  addedAt: Date;

  @Prop({ type: String, ref: 'Bank' })
  bank: string;

  @Prop({ type: String, ref: 'App' })
  app: string;

  @Prop({ type: String, ref: 'Client' })
  client: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
