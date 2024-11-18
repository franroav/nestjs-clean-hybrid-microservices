import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueuesService } from './queues.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'taskQueue',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [QueuesService],
  exports: [QueuesService],
})
export class QueueModule {}
