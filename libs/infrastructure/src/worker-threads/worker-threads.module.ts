import { Module } from '@nestjs/common';
import { WorkerThreadsService } from './worker-threads.service';

@Module({
  providers: [WorkerThreadsService],
  exports: [WorkerThreadsService],
})
export class WorkerThreadsModule {}
