import { Module } from '@nestjs/common';
import { ChildProcessesService } from './child-processes.service';

@Module({
  providers: [ChildProcessesService],
  exports: [ChildProcessesService],
})
export class ChildProcessesModule {}
