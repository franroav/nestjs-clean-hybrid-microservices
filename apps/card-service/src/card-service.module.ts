import { Module } from '@nestjs/common';
import { CardServiceController } from './card-service.controller';
import { CardServiceService } from './card-service.service';

@Module({
  imports: [],
  controllers: [CardServiceController],
  providers: [CardServiceService],
})
export class CardServiceModule {}
