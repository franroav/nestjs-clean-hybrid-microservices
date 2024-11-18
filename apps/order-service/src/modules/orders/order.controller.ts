// apps/order-service/src/controllers/order.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './interfaces/order.interface';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    createOrder(@Body() orderDto: CreateOrderDto, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
        return this.orderService.createOrder(orderDto, idTrace, consumer);
    }

    @Get(':id')
    getOrder(@Param('id') orderId: string, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
        return this.orderService.findOrder(orderId, idTrace, consumer);
    }

    // Other controller methods can be added here...
}
