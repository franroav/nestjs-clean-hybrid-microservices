import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  orderId: string;

  @Prop()
  transactionId: string;

  @Prop({ type: Types.ObjectId, ref: 'Account' })
  account: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
