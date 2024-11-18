import { PartialType } from '@nestjs/mapped-types';
import { CreateCampoDto } from './create-campo.dto';
import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCampoDto extends PartialType(CreateCampoDto)  {
    @ApiProperty()
    @IsOptional()
    @IsString()
    nombre?: string;
  
    @ApiProperty()
    @IsOptional()
    @IsString()
    ubicacion?: string;
  
    @ApiProperty()
    @IsOptional()
    @IsInt()
    agricultorId?: number;
  }
