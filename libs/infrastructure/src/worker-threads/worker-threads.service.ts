import { Injectable, Logger } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';

@Injectable()
export class WorkerThreadsService {
  private readonly logger = new Logger(WorkerThreadsService.name);

  async executeTask(data: any): Promise<any> {
    if (data === null || data === undefined) {
      return Promise.reject(new Error('Invalid data provided to worker.'));
    }

    return new Promise((resolve, reject) => {
      const worker = new Worker(path.resolve(__dirname, 'worker-task.js'), { workerData: data });

      worker.on('message', (result) => {
        this.logger.log(`Worker completed task with result: ${result}`);
        resolve(result);
      });

      worker.on('error', (error) => {
        this.logger.error(`Worker encountered an error: ${error.message}`);
        reject(error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          const errorMsg = `Worker stopped with exit code ${code}`;
          this.logger.error(errorMsg);
          reject(new Error(errorMsg));
        }
      });
    });
  }
}
