import { PartialType } from '@nestjs/mapped-types';
import { CreateAgricultoreDto } from './create-agricultore.dto';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateAgricultoreDto extends PartialType(CreateAgricultoreDto) {
    @IsOptional()
    @IsString()
    nombre?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  }
