// create_account.dto.ts
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsUUID() // Ensure customerId is a valid UUID
  @IsNotEmpty()
  readonly customerId: string;

  readonly accountNumber: string;

  readonly accountType: 'Savings' | 'Checking'; // Literal types for validation

  readonly balance: number;
}