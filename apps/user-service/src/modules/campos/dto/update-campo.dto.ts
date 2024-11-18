import { PartialType } from '@nestjs/mapped-types';
import { CreateCampoDto } from './create-campo.dto';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateCampoDto extends PartialType(CreateCampoDto)  {
    @IsOptional()
    @IsString()
    nombre?: string;
  
    @IsOptional()
    @IsString()
    ubicacion?: string;
  
    @IsOptional()
    @IsInt()
    agricultorId?: number;
  }
