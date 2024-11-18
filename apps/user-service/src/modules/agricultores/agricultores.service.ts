import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAgricultoreDto } from './dto/create-agricultore.dto';
import { UpdateAgricultoreDto } from './dto/update-agricultore.dto';
import { Agricultor } from './entities/agricultore.entity';
import { InjectModel } from '@nestjs/sequelize';
import { AtributoLogEntity } from '../transaction-logs/entities/atributo-log.entity';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { Utils } from '../../../../../libs/shared/src/utils/utils.helper';
import { createConnection } from '@app/adapters/database/connection.postgre';
@Injectable()
export class AgricultoresService {
  constructor(
    @InjectModel(Agricultor)
    private agricultorRepository: typeof Agricultor,
    private readonly transactionLogsService: TransactionLogsService,
  ) {}

  private readonly CODIGO_SERVICIO: string = 'X';
  private readonly SERVICIO: string = `Servicio - ${AgricultoresService.name}`;

  findByEmail(email: string) {
    return this.agricultorRepository.findOne({ where: { email } });
  }

  async create(createAgricultorDto: CreateAgricultoreDto) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'crear_agricultor';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Crear agricultor()`;
    atributoLogEntity.inicio = Date.now();

    const exists = await this.findByEmail(createAgricultorDto['email']);
    if (exists) {
      atributoLogEntity.respuesta = `Respuesta Controlada: Email already exists for Agricultor - Status: ${HttpStatus.CONFLICT}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException('Email already exists for Agricultor', HttpStatus.CONFLICT);
    }

    try {
      atributoLogEntity.respuesta = `El agricultor ha sido creada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.agricultorRepository.create(createAgricultorDto as any);
      return utils.templateResponse(data, HttpStatus.OK, `El agricultor ha sido creada correctamente - Status: ${HttpStatus.OK}`,`${this.SERVICIO} - Método Crear agricultor()`);
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      atributoLogEntity.respuesta = `Error: ${error.message} - Status:${status}`;
      atributoLogEntity.estado = '0';
      atributoLogEntity.response = error;
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(error.message, status);
    }

  }

  async findAll() {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'listar_agricultores';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Listar agricultores()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de listar agricultores obtenida correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.agricultorRepository.findAll();
      return utils.templateResponse(data, HttpStatus.OK, `Consulta de listar agricultores obtenida correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método Listar agricultores()`);
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      atributoLogEntity.respuesta = `Error: ${error.message} - Status:${status}`;
      atributoLogEntity.estado = '0';
      atributoLogEntity.response = error;
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(error.message, status);
    }
    

  }

  async findOne(id: number) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'consulta_agricultor';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método buscar agricultor()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de agricultor ${id} obtenida correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.agricultorRepository.findByPk(id);
      return utils.templateResponse(data, HttpStatus.OK, `Consulta de agricultor ${id} obtenida correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método buscar agricultor()`);
      
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      atributoLogEntity.respuesta = `Error: ${error.message} - Status:${status}`;
      atributoLogEntity.estado = '0';
      atributoLogEntity.response = error;
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(error.message, status);
    }
  }

  async update(id: number, updateAgricultorDto: UpdateAgricultoreDto) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'actualizar_agricultor';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método actualizar agricultor()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Actualizar agricultor ${id} guardado correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.agricultorRepository.update(updateAgricultorDto as any, { where: { id } });
      return utils.templateResponse(data, HttpStatus.OK,  `Actualizar agricultor ${id} guardado correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método actualizar agricultor()`);
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      atributoLogEntity.respuesta = `Error: ${error.message} - Status:${status}`;
      atributoLogEntity.estado = '0';
      atributoLogEntity.response = error;
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(error.message, status);
    }
   
  }

  async remove(id: number) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'eliminar_agricultor';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método eliminar agricultor()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `El agricultor ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.agricultorRepository.destroy({ where: { id } });
      return utils.templateResponse(data, HttpStatus.OK, `El agricultor ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método eliminar agricultor()`);
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      atributoLogEntity.respuesta = `Error: ${error.message} - Status:${status}`;
      atributoLogEntity.estado = '0';
      atributoLogEntity.response = error;
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(error.message, status);
    }
  }
}