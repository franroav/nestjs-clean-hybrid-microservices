import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Transfer extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order' })
  order: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Commerce' })
  commerce: Types.ObjectId;

  @Prop({ required: true })
  status: string;

  @Prop()
  creditNoteId: string;

  @Prop({ required: true })
  addedAt: Date;

  @Prop({ required: true })
  amount: number;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
