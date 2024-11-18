import { PartialType } from '@nestjs/mapped-types';
import { CreateFrutaDto } from './create-fruta.dto';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFrutaDto extends PartialType(CreateFrutaDto) {
    @ApiProperty()
    @IsOptional()
    @IsString()
    nombre?: string;
  }
