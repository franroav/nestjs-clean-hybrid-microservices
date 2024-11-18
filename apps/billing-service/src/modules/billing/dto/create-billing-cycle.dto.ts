import { PartialType } from '@nestjs/mapped-types';
import { BillingCycle } from "../entities/billing_cycle.entity";

export class CreateBillingCycleDto extends PartialType(BillingCycle) {
    readonly name: string;  // e.g., 'monthly', 'quarterly', 'yearly'
    readonly period: number;  // Number of days or months that define the billing cycle
    readonly startDate: Date;  // When this billing cycle starts
    readonly endDate: Date;    // When this billing cycle ends
    cycleName: string; // Make sure this matches BillingCycle
    duration: number;  // Make sure this matches BillingCycle
  }