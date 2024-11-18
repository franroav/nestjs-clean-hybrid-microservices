// apps/order-service/src/models/order.model.ts
import { Schema, Document, model } from 'mongoose';

export interface Order extends Document {
    orderId: string;
    commerceUserId: string;
    app: string;
    account: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema({
    orderId: { type: String, required: true },
    commerceUserId: { type: String, required: true },
    app: { type: Schema.Types.ObjectId, ref: 'App', required: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
}, { timestamps: true });

export const OrderModel = model<Order>('Order', OrderSchema);
