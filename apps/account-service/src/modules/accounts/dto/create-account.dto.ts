import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountTitular: string;

  @IsString()
  @IsNotEmpty()
  accountDni: string;

  @IsString()
  @IsNotEmpty()
  accountType: string;

  @IsString()
  bank: string;

  @IsString()
  app: string;

  @IsString()
  client: string;
}
