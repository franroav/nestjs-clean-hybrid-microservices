import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingCycleDto } from './create-billing-cycle.dto';

export class UpdateBillingCycleDto extends PartialType(CreateBillingCycleDto) {
  readonly id: number;
  cycleName?: string; // Optional for updates
  duration?: number;  // Optional for updates
}