import { Inject, Injectable, Logger } from '@nestjs/common';
import { AgricultoresService } from './modules/agricultores/agricultores.service';
import { CamposService } from './modules/campos/campos.service';
import { ClientesService } from './modules/clientes/clientes.service';
import { FrutasService } from './modules/frutas/frutas.service';
import { VariedadesService } from './modules/variedades/variedades.service';
import { ClientProxy } from '@nestjs/microservices';



export interface ResponseTemplate {
  code: number | null;
  message: string;
  request: any;
  errors: any | null;
  entities?: string | null;
  response?: any | null;
}

export interface SuccessResponseTemplate extends ResponseTemplate {
  code: 200;
  entities: string | null;
  response: any | null;
}

export interface RejectResponseTemplate extends ResponseTemplate {
  code: number;
  errors: any | null;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('MAIL_SERVICE') private clientMail: ClientProxy,
    @Inject('USER_SERVICE') private userService: ClientProxy,
    private readonly agricultorService: AgricultoresService,
    private readonly clienteService: ClientesService,
    private readonly campoService: CamposService,
    private readonly frutaService: FrutasService,
    private readonly variedadService: VariedadesService,
  ) {}

  async updateFileIntoDb(data: any) {
    if (data.length < 1) return { exitosas: [], rechazadas: [] };

    const successfully: SuccessResponseTemplate[] = [];
    const rejected: RejectResponseTemplate[] = [];

    for (const row of data) {
      if (this.hasEmptyValues(row)) {
        this.logger.warn(`Skipping row with empty values: ${JSON.stringify(row)}`);
        continue;
      }

      const promises = this.createPromises(row);
      const results = await Promise.allSettled(promises);

      this.processResults(results, row, successfully, rejected);

      await this.delay(200);
    }

    return { count: [...successfully, ...rejected].length, data: successfully, rechazadas: rejected };
  }

  private hasEmptyValues(row: any): boolean {
    return !(
      row["Mail Agricultor"] && row["Nombre Agricultor"] && row["Apellido Agricultor"] &&
      row["Mail Cliente"] && row["Nombre Cliente"] && row["Apellido Cliente"] &&
      row["Nombre Campo"] && row["Ubicación de Campo"] &&
      row["Fruta Cosechada"] && row["Variedad Cosechada"]
    );
  }

  private createPromises(row: any): Promise<any>[] {
    return [
      this.createAgricultor({ nombre: `${row["Nombre Agricultor"]} ${row["Apellido Agricultor"]}`, email: row["Mail Agricultor"] }),
      this.createCliente({ nombre: `${row["Nombre Cliente"]} ${row["Apellido Cliente"]}`, email: row["Mail Cliente"] }),
      this.createCampo({ nombre: row["Nombre Campo"], ubicacion: row["Ubicación de Campo"] }),
      this.createFruta({ nombre: row["Fruta Cosechada"] }),
      this.createVariedad({ nombre: row["Variedad Cosechada"], fruta: row["Fruta Cosechada"] }),
    ];
  }

  private processResults(
    results: PromiseSettledResult<any>[],
    row: any,
    successfully: SuccessResponseTemplate[],
    rejected: RejectResponseTemplate[]
  ) {
    results.forEach((result) => {
      if (result.status === 'rejected') {
        const rejectResponseTemplate: RejectResponseTemplate = {
          code: (result.reason as any)['status'] || 400,
          message: 'Solicitud rechazada para insertar a base de datos.',
          request: row,
          errors: result.reason,
        };
        rejected.push(rejectResponseTemplate);
      } else {
        const successResponseTemplate: SuccessResponseTemplate = {
          code: 200,
          message: 'Información insertada satisfactoriamente.',
          request: row,
          entities: (result.value as any).constructor.name,
          response: result.value,
          errors: null
        };
        successfully.push(successResponseTemplate);
      }
    });
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async createAgricultor(data: any) {
    try {
      return await this.agricultorService.create(data);
    } catch (error: any) {
      this.logger.error(`Error creating agricultor: ${JSON.stringify(data)}`, { error: error.message, stack: error.stack });
      throw error;
    }
  }

  private async createCliente(data: any) {
    try {
      return await this.clienteService.create(data);
    } catch (error: any) {
      this.logger.error(`Error creating cliente: ${JSON.stringify(data)}`, { error: error.message, stack: error.stack });
      throw error;
    }
  }

  private async createCampo(data: any) {
    try {
      return await this.campoService.create(data);
    } catch (error: any) {
      this.logger.error(`Error creating campo: ${JSON.stringify(data)}`, { error: error.message, stack: error.stack });
      throw error;
    }
  }

  private async createFruta(data: any) {
    try {
      return await this.frutaService.create(data);
    } catch (error: any) {
      this.logger.error(`Error creating fruta: ${JSON.stringify(data)}`, { error: error.message, stack: error.stack });
      throw error;
    }
  }

  private async createVariedad(data: any) {
    try {
      return await this.variedadService.create(data);
    } catch (error: any) {
      this.logger.error(`Error creating variedad: ${JSON.stringify(data)}`, { error: error.message, stack: error.stack });
      throw error;
    }
  }

  newUser(user: any) {
    this.logger.log('Emitting new user event', user);
    
    this.clientMail.emit('new_mail', user).toPromise()
      .then(() => this.logger.log('Email event sent'))
      .catch(err => this.logger.error('Error sending email event', err));
  
    this.userService.emit('new_user', user).toPromise()
      .then(() => this.logger.log('User event sent'))
      .catch(err => this.logger.error('Error sending user event', err));
  
    return 'Events sent to queues';
  }
}
