import { Module } from "@nestjs/common";
import { NotificationService} from "./notification.service";
import { BullModule } from "@nestjs/bullmq";
import { join } from 'path';

@Module({
  imports: [
    // BullModule.registerFlowProducer({
    //   name: "flowProducerName",
    // }),
    // BullModule.registerQueue({
    //   name: "audio",
    //   processors: [join(__dirname, "processor.js")],
    // }),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NoticationModule {}