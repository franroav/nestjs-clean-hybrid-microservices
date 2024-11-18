import { Module } from "@nestjs/common";
import { OrdersService } from "./order.service";
import { BullModule } from "@nestjs/bullmq";
import { join } from 'path';

@Module({
  imports: [
    BullModule.registerFlowProducer({
      name: "flowProducerName",
    }),
    BullModule.registerQueue({
      name: "audio",
      processors: [join(__dirname, "processor.js")],
    }),
  ],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
