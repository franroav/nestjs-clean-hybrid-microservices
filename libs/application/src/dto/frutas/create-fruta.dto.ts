import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateFrutaDto  {
  
    @ApiProperty()
    @IsString()
    nombre: string;
  }
