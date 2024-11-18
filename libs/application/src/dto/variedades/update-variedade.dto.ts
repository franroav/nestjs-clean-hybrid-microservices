import { PartialType } from '@nestjs/mapped-types';
import { CreateVariedadeDto } from './create-variedade.dto';
import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVariedadeDto extends PartialType(CreateVariedadeDto) {
    @ApiProperty()
    @IsOptional()
    @IsString()
    nombre?: string;
  
    @ApiProperty()
    @IsOptional()
    @IsInt()
    frutaId?: number;
  }
