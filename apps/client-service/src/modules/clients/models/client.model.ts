import { Schema, Document } from 'mongoose';

export interface Client extends Document {
    dni: string;
    byApp: {
        email: string;
        commerceUserId: string;
        app: string;
    };
}

export const ClientSchema = new Schema({
    dni: { type: String, required: true },
    byApp: {
        email: { type: String, required: true },
        commerceUserId: { type: String, required: true },
        app: { type: String, required: true },
    },
}, { timestamps: true });
