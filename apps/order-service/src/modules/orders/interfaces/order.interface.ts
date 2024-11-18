// apps/order-service/src/interfaces/order.interface.ts
export interface CreateOrderDto {
    orderId: string;
    commerceUserId: string;
    app: string;
    account: string;
}

export interface UpdateOrderDto {
    orderId?: string;
    commerceUserId?: string;
    app?: string;
    account?: string;
}
