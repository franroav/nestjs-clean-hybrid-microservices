import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppDocument = App & Document;

@Schema()
export class App {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AppSchema = SchemaFactory.createForClass(App);
