import { IsString } from "class-validator";
export class CreateFrutaDto {
  @IsString()
  nombre: string;

  // Constructor-based initialization
  constructor(nombre: string) {
    this.nombre = nombre;
  }
}
