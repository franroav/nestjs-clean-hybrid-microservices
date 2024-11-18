// create-cosecha.dto.ts
import { IsInt, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


export class CreateCosechaDto {

  @ApiProperty()
  @IsInt()
  frutaId: number;

  @ApiProperty()
  @IsInt()
  variedadeId: number;

  @ApiProperty()
  @IsInt()
  agricultorId: number;

  @ApiProperty()
  @IsInt()
  campoId: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  fechaCosecha: Date;

  @ApiProperty()
  @IsNumber()
  cantidad: number;
}
