import { IsString, IsInt } from 'class-validator';

export class CreateVariedadeDto {
    @IsString()
    nombre: string;
  
    @IsInt()
    frutaId: number;

  // Constructor-based initialization
  constructor(
    nombre: string,
    frutaId: number,
  ) {
    this.nombre = nombre
    this.frutaId = frutaId
  }
    
}
