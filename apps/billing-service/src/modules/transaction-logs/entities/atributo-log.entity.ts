import { IsNumber, IsString } from "class-validator";

export class AtributoLogEntity {

    @IsString()
    uuid?: string;

    @IsString()
    codigo?: string; // Diferenciar todos los servicios, todos los servicios tienen codigo único

    @IsString()
    titulo?: string; // Título descriptivo

    @IsString()
    respuesta? = 'Error - Problemas Internos del Servidor - Status: 500'; //Response -  Si vienen datos sensible no mostrar

    @IsString()
    url?: string; //URL del servicio

    @IsString()
    estado?: string; // 1 OK - 0 NOK 

    @IsNumber()
    inicio: number | undefined; // Inicio de ejecucion del servicio

    @IsString()
    lugar?: string;  // "Servicio"

    metadata?: any;  // "Metadata"

    response?: any

      // Constructor-based initialization
//   constructor(uuid: string, codigo: string, titulo: string, url: string, estado: string, inicio: number, lugar: string, respuesta: string, metadata: any, response: any) {
//     this.uuid = uuid;
//     this.codigo = codigo;
//     this.url = url
//     this.titulo = titulo
//     this.estado = estado
//     this.lugar = lugar
//     this.inicio = inicio 
//     this.respuesta = respuesta
//     this.metadata = metadata 
//     this.response = response

//   }


 
}