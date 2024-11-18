import { IsUUID, IsString, IsBoolean, IsNotEmpty, IsObject } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PaymentMethod } from '../entities/payment_method.entity';

export class CreatePaymentMethodDto extends PartialType(PaymentMethod) {
  @IsUUID()
  @IsNotEmpty()
  readonly customerId: string; // Match the UUID type

  @IsString()
  @IsNotEmpty()
  readonly methodType: string; // e.g., 'credit_card', 'bank_transfer', 'paypal'

  @IsObject()
  @IsNotEmpty()
  readonly details: Record<string, any>; // JSONB to store flexible details for the payment method

  @IsBoolean()
  readonly isDefault: boolean;
}