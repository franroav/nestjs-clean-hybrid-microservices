// app.module.ts
import { Module } from '@nestjs/common';
import { MessagingService } from '@app/shared/messaging/messaging.service';
import { KafkaStrategy } from '@app/shared/messaging/kafka-strategy';

@Module({
  providers: [
    MessagingService,
    {
      provide: 'MessagingStrategy',
      useClass: KafkaStrategy, // Or switch to RabbitMQStrategy as needed
    },
  ],
})
export class MessagingModule {}
