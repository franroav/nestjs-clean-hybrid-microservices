import { IsString, IsEmail } from 'class-validator';

export class CreateClienteDto {
    @IsString()
    nombre: string;
  
    @IsEmail()
    email: string;
  
    // Constructor-based initialization
    constructor(
      nombre: string,
      email: string,
    ) {
      this.nombre = nombre;
      this.email = email;
    }
  
  }