// libs/application/src/services/messaging.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { MessagingStrategy } from '@app/shared/messaging/messaging-strategy.interface';

@Injectable()
export class MessagingService {
  constructor(
    @Inject('MessagingStrategy') private messagingStrategy: MessagingStrategy
  ) {}

  async send(topic: string, message: string): Promise<void> {
    await this.messagingStrategy.sendMessage(topic, message);
  }
}
