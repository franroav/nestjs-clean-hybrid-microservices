import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SharedService } from './shared.service';
import { XRayMiddleware } from './middlewares/xray.middleware';

@Module({
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule implements NestModule {


  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(XRayMiddleware).forRoutes('*');
  }
}
