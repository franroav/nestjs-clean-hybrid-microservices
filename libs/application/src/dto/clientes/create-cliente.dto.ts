import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateClienteDto {
    @ApiProperty()
    @IsString()
    nombre: string;
  
    @ApiProperty()
    @IsEmail()
    email: string;
  }
