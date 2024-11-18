// libs/infrastructure/src/messaging/kafka-strategy.ts
import { MessagingStrategy } from '@app/shared/messaging/messaging-strategy.interface';

export class KafkaStrategy implements MessagingStrategy {
  async sendMessage(topic: string, message: string): Promise<void> {
    // Implementation for Kafka
  }
}

