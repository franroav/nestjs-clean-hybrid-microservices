import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateVariedadeDto {

    @ApiProperty()
    @IsString()
    nombre: string;
  
    @ApiProperty()
    @IsInt()
    frutaId: number;
  }
