import { Injectable, Logger } from '@nestjs/common';
import cluster from 'cluster';
import * as os from 'os';

@Injectable()
export class ClusteringService {
  private readonly logger = new Logger(ClusteringService.name);

  async runInCluster<T>(callback: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (cluster.isPrimary) {
        const numCPUs = os.cpus().length;
        for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
        }

        cluster.on('exit', (worker) => {
          this.logger.log(`Worker ${worker.process.pid} died. Starting a new worker.`);
          cluster.fork();
        });
      } else {
        callback()
          .then(resolve)
          .catch(reject);
      }
    });
  }
}