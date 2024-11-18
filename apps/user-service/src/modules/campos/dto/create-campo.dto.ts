import { IsString, IsInt } from "class-validator";

export class CreateCampoDto {
  @IsString()
  nombre: string;

  @IsString()
  ubicacion: string;

  @IsInt()
  agricultorId: number;
  // Constructor-based initialization
  constructor(nombre: string, ubicacion: string, agricultorId: number) {
    this.nombre = nombre;
    this.ubicacion = ubicacion;
    this.agricultorId = agricultorId;
  }
}
