// apps/order-service/src/services/order.service.ts
import { Injectable } from '@nestjs/common';
import { OrderDao } from './dao/order.dao';
import { CreateOrderDto, UpdateOrderDto } from './interfaces/order.interface';

@Injectable()
export class OrderService {
    constructor(private readonly orderDao: OrderDao) {}

    createOrder(orderDto: CreateOrderDto, idTrace: string, consumer: string) {
        return this.orderDao.insertOrder(orderDto, idTrace, consumer);
    }

    findOrder(orderId: string, idTrace: string, consumer: string) {
        return this.orderDao.getOrder(orderId, idTrace, consumer);
    }

    // Other service methods can be added here...
}
