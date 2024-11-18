// response-cosecha.dto.ts
import { IsInt, IsDate, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseCosechaDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsInt()
  frutaId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  variedadeId: number | null;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  agricultorId: number | null;

  @ApiProperty()
  @IsInt()
  campoId: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaCosecha: Date | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  cantidad: number | null;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}