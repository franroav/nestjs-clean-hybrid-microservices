import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import { CreateBillingDto } from './create-billing.dto';

export class UpdateBillingDto extends PartialType(CreateBillingDto) {
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  // Add default values to avoid TypeScript errors if fields are not assigned
  constructor() {
    super();
    this.id = '';
    this.userId = 0;
    this.amount = 0.0;
    this.description = '';
    this.date = new Date();
  }
}