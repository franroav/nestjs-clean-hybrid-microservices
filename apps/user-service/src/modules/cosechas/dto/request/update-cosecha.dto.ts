import { PartialType } from '@nestjs/mapped-types';
import { CreateCosechaDto } from './create-cosecha.dto';

import { IsInt, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCosechaDto extends PartialType(CreateCosechaDto) {
    @IsOptional()
    @IsInt()
    frutaId?: number;
  
    @IsOptional()
    @IsInt()
    variedadeId?: number;
  
    @IsOptional()
    @IsInt()
    agricultorId?: number;
  
    @IsOptional()
    @IsInt()
    campoId?: number;
  
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fechaCosecha?: Date;
  
    @IsOptional()
    @IsNumber()
    cantidad?: number;
  }
