import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueuesService {
  constructor(@InjectQueue('taskQueue') private readonly taskQueue: Queue) {}

  async addToQueue(data: any) {
    await this.taskQueue.add(data);
  }
}
