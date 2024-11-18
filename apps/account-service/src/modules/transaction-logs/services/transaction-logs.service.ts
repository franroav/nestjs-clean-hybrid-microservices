import { Inject, Injectable, Logger} from "@nestjs/common";
import { AtributoLogEntity } from "../entities/atributo-log.entity";
import { v4 as uuidv4 } from "uuid";
import { LogExecutionTime } from "@app/shared/decorators/log-execution-time.decorator";
import { Throttle } from "@nestjs/throttler";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

interface TransactionLog {
  uuid: string;
  codigo: string;
  titulo: string;
  respuesta: string;
  url: string;
  estado: string;
  tiempo: string;
  lugar: string;
  metadata: any;
  response: any;
}

interface ThrottlerMethodOrControllerOptions {
  limit: number; // The maximum number of requests
  ttl: number;   // The time window in seconds
}

@Injectable()
@ApiTags('Transaction Logs')
export class TransactionLogsService {
  constructor(@Inject('UUID_GENERATOR') private readonly uuidGenerator: () => string) {}

  generateUUID(): string {
    return uuidv4() || this.uuidGenerator();
  }

  getTime(fecha1: number, fecha2: number = Date.now()): string {
    return new Date(fecha2 - fecha1).toISOString().slice(11, -1); // "HH:MM:SS.sss"
  }

  @ApiOperation({ summary: "Log a transaction with detailed attributes" })
  @ApiResponse({ status: 201, description: 'Transaction log created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid transaction log data.' })
  transactionLogs(atributosLogs: Partial<AtributoLogEntity>): void {
    const transactionLogs: TransactionLog = {
      uuid: atributosLogs.uuid!,
      codigo: atributosLogs.codigo!,
      titulo: atributosLogs.titulo!,
      respuesta: atributosLogs.respuesta!,
      url: atributosLogs.url!,
      estado: atributosLogs.estado!,
      tiempo: this.getTime(atributosLogs.inicio!),
      lugar: atributosLogs.lugar!,
      metadata: atributosLogs.metadata,
      response: atributosLogs.response,
    };
    console.log(JSON.stringify(transactionLogs));
  }

  @LogExecutionTime('debug')
    // Apply throttle with limit and ttl as an options object
  // @Throttle({ limit: 10, ttl: 60 }) // 10 requests per 60 seconds
  // @Timeout(5000) // Fails the operation if it takes more than 5 seconds
  async performTask(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a delay
      console.log('Task completed!');
    } catch (error) {
      Logger.error('Error in performTask', error);
    }
  }
}