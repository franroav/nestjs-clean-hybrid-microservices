import { IsDate, IsInt, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // Importing the correct Type decorator

export class ResponseCosechaDto {
  @IsInt()
  id: number;

  @IsInt()
  frutaId: number;

  @IsOptional()
  @IsInt()
  variedadeId: number | null;

  @IsOptional()
  @IsInt()
  agricultorId: number | null;

  @IsInt()
  campoId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)  // Correct use of Type decorator from class-transformer
  fechaCosecha: Date | null;

  @IsOptional()
  @IsNumber()
  cantidad: number | null;

  @IsDate()
  @Type(() => Date)  // Correct use here too
  createdAt: Date;

  @IsDate()
  @Type(() => Date)  // Correct use here too
  updatedAt: Date;

  constructor(
    id: number,
    frutaId: number,
    campoId: number,
    createdAt: Date,
    updatedAt: Date,
    variedadeId: number | null = null,
    agricultorId: number | null = null,
    fechaCosecha: Date | null = null,
    cantidad: number | null = null
  ) {
    this.id = id;
    this.frutaId = frutaId;
    this.variedadeId = variedadeId;
    this.agricultorId = agricultorId;
    this.campoId = campoId;
    this.fechaCosecha = fechaCosecha;
    this.cantidad = cantidad;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
