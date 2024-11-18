import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Commerce extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  app: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CommerceSchema = SchemaFactory.createForClass(Commerce);
