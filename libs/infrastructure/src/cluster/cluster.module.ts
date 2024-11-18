import { Module } from '@nestjs/common';
import { ClusteringService } from './cluster.service';

@Module({
  providers: [ClusteringService],
  exports: [ClusteringService],
})
export class ClusteringModule {}
