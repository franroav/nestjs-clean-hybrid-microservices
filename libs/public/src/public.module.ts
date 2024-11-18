import { Module } from '@nestjs/common';
import { PublicService } from './public.service';

@Module({
  providers: [PublicService],
  exports: [PublicService],
})
export class PublicModule {}
