import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';

@Module({
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
