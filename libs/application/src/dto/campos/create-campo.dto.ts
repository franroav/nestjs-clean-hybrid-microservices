import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateCampoDto {
    @ApiProperty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsString()
    ubicacion: string;
    
    @ApiProperty()
    @IsInt()
    agricultorId: number;
  }