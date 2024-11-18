import { Injectable, Scope } from "@nestjs/common";
import { Queue, Job } from "bullmq";
import {
  InjectQueue,
  Processor,
  WorkerHost,
  QueueEventsHost,
  QueueEventsListener,
  OnQueueEvent,
} from "@nestjs/bullmq";

@Injectable()
export class OrdersService {
  constructor(@InjectQueue("orders") private ordersQueue: Queue) {}

  async addQueue() {
    const job = await this.ordersQueue.add("transcode", {
      foo: "bar",
    });
  }
}

@Processor({
  name: "audio",
  scope: Scope.REQUEST,
})
export class AudioConsumer extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case "transcode": {
        let progress = 0;
        for (let i = 0; i < 100; i++) {
          await this.doSomething(job.data);
          progress += 1;
          await job.updateProgress(progress);
        }
        return {};
      }
      case "concatenate": {
        await this.doSomeLogic2();
        break;
      }
    }
  }

  private async doSomething(data: any) {
    // Logic to process job data
  }

  private async doSomeLogic2() {
    // Logic for additional processing
  }
}

@QueueEventsListener("audio")
export class AudioEventsListener extends QueueEventsHost {
  @OnQueueEvent("active" as const)
  onActive(
    job: { jobId: string; prev?: string },
    _context?: unknown,
    _descriptor?: PropertyDescriptor
  ): void {
    console.log(`Processing job ${job.jobId}...`);
  }
}
