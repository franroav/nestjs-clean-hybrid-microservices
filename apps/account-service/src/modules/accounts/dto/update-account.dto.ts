import { IsString, IsOptional } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  accountTitular?: string;

  @IsString()
  @IsOptional()
  accountDni?: string;

  @IsString()
  @IsOptional()
  accountType?: string;

  @IsOptional()
  isDelete?: boolean;
}
