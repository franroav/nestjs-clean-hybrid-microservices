// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// @Schema()
// export class Transfer extends Document {
//   @Prop({ type: Types.ObjectId, ref: 'Order' })
//   order: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'Commerce' })
//   commerce: Types.ObjectId;

//   @Prop({ required: true })
//   status: string;

//   @Prop()
//   creditNoteId: string;

//   @Prop({ required: true })
//   addedAt: Date;

//   @Prop({ required: true })
//   amount: number;
// }

// export const TransferSchema = SchemaFactory.createForClass(Transfer);



import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Order } from './order.model';

@Schema()
export class Transfer extends Document {
  @Prop() status: string;
  @Prop() creditNoteId: string;
  @Prop() addedAt: Date;
  @Prop() amount: number;
  @Prop({ type: Order }) order: Order;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
