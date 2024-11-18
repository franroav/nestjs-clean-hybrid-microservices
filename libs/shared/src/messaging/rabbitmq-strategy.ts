// libs/infrastructure/src/messaging/rabbitmq-strategy.ts
import { MessagingStrategy } from '@app/shared/messaging/messaging-strategy.interface';

export class RabbitMQStrategy implements MessagingStrategy {
  async sendMessage(topic: string, message: string): Promise<void> {
    // Implementation for RabbitMQ
  }
}
