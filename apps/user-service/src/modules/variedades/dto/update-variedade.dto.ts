import { PartialType } from '@nestjs/mapped-types';
import { CreateVariedadeDto } from './create-variedade.dto';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateVariedadeDto extends PartialType(CreateVariedadeDto) {
    @IsOptional()
    @IsString()
    nombre?: string;
  
    @IsOptional()
    @IsInt()
    frutaId?: number;
  }
