import { IsString } from "class-validator";

export class AtributoLogEntity {

    @IsString()
    uuid: string;

    @IsString()
    codigo: string; // Diferenciar todos los servicios, todos los servicios tienen codigo único

    @IsString()
    titulo: string; // Título descriptivo

    @IsString()
    respuesta = 'Error - Problemas Internos del Servidor - Status: 500'; //Response -  Si vienen datos sensible no mostrar

    @IsString()
    url: string; //URL del servicio

    @IsString()
    estado: string; // 1 OK - 0 NOK 

    @IsString()
    inicio: number; // Inicio de ejecucion del servicio

    @IsString()
    lugar: string;  // "Servicio"

    metadata: any;  // "Metadata"

    response: any
 
}