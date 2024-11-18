import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentMethodDto } from './create-payment-method.dto';
import { IsOptional, IsUUID } from 'class-validator'; // Ensure correct import

export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {
  // @IsOptional()  // Mark as optional
  // @IsUUID('4') // Apply IsUUID decorator properly
  readonly id: string; // ID for the payment method to be updated
}