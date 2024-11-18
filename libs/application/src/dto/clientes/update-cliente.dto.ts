import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateClienteDto extends PartialType(CreateClienteDto) {

    @ApiProperty()
    @IsOptional()
    @IsString()
    nombre?: string;
  
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email?: string;
  }
