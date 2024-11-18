import { PartialType } from '@nestjs/mapped-types';
import { CreateFrutaDto } from './create-fruta.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateFrutaDto extends PartialType(CreateFrutaDto) {
    @IsOptional()
    @IsString()
    nombre?: string;
  }
