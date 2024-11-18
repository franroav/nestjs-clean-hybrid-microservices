// libs/shared/src/models/bank.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Bank extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    code: string;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
