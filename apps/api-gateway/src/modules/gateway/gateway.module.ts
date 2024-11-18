

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GatewayController } from './infrastructure/controllers/gateway.controller';
import { GatewayService } from './application/services/gateway.service';
import { HttpAdapter } from './infrastructure/adapters/http/implementation/http.adapter';

@Module({
  imports: [HttpModule], // Import HttpModule here
  controllers: [GatewayController],
  providers: [GatewayService, HttpAdapter],
})
export class GatewayModule {}// import { Module, MiddlewareConsumer } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { ProxyService } from './infrastructure/adapters/proxy/proxy.service';
// import { GatewayModule } from './modules/gateway/gateway.module'; // Adjust the import path as needed

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     GatewayModule,
//   ],
//   providers: [ProxyService],
// })
// export class AppModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(ProxyService).forRoutes('*');
//   }
// }



