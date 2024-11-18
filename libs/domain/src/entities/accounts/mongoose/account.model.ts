import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Account extends Document {
  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  accountDni: string;

  @Prop({ required: true })
  accountType: string;

  @Prop()
  bank: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

