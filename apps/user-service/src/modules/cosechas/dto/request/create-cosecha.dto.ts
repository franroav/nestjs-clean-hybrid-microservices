import { IsInt, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCosechaDto {
  @IsInt()
  frutaId: number;

  @IsInt()
  variedadeId: number;

  @IsInt()
  agricultorId: number;

  @IsInt()
  campoId: number;

  @IsDate()
  @Type(() => Date)
  fechaCosecha: Date;

  @IsNumber()
  cantidad: number;

  // Constructor-based initialization
  constructor(
    frutaId: number,
    variedadeId: number,
    agricultorId: number,
    campoId: number,
    fechaCosecha: Date,
    cantidad: number
  ) {
    this.frutaId = frutaId;
    this.variedadeId = variedadeId;
    this.agricultorId = agricultorId;
    this.campoId = campoId;
    this.fechaCosecha = fechaCosecha;
    this.cantidad = cantidad;
  }
}
