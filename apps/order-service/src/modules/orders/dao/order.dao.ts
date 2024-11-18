// apps/order-service/src/dao/order.dao.ts
import { Injectable, Logger } from '@nestjs/common';
import { OrderModel, Order } from '../models/order.model';
import { CreateOrderDto, UpdateOrderDto } from '../interfaces/order.interface';

@Injectable()
export class OrderDao {
    async insertOrder(orderData: CreateOrderDto, idTrace: string, consumer: string) {
        const newOrder = new OrderModel(orderData);
        try {
            const orderSaved = await newOrder.save();
            return { isResult: true, data: orderSaved };
        } catch (err) {
            Logger.error('Error inserting order', { idTrace, consumer, error: err.stack });
            return { isResult: false, error: err.stack };
        }
    }

    async getOrder(orderId: string, idTrace: string, consumer: string) {
        try {
            const order = await OrderModel.findById(orderId).populate('app account');
            return { isResult: true, data: order };
        } catch (err) {
            Logger.error('Error fetching order', { idTrace, consumer, error: err.stack });
            return { isResult: false, error: err.stack };
        }
    }

    // Other methods can be similarly implemented...
}
