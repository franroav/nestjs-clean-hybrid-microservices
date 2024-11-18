import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { InjectModel } from '@nestjs/sequelize';
import { AtributoLogEntity } from '../transaction-logs/entities/atributo-log.entity';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { Utils } from '../../../../../libs/shared/src/utils/utils.helper';
@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente)
    private clienteRepository: typeof Cliente,
    private readonly transactionLogsService: TransactionLogsService,
  ) {}

  private readonly CODIGO_SERVICIO: string = 'X';
  private readonly SERVICIO: string = `Servicio - ${ClientesService.name}`;
  
  findByEmail(email: string) {
    return this.clienteRepository.findOne({ where: { email } });
  }


  async create(createClienteDto: CreateClienteDto) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'crear_cliente';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Crear cliente()`;
    atributoLogEntity.inicio = Date.now();
    const exists = await this.findByEmail(createClienteDto['email']);
    if (exists) {
      atributoLogEntity.respuesta = `Email already exists for Cliente - Status: ${HttpStatus.CONFLICT}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException('Email already exists for Cliente', HttpStatus.CONFLICT);
    }

    try {
      atributoLogEntity.respuesta = `Respuesta Controlada: El cliente ha sido creado correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.clienteRepository.create(createClienteDto as any);
      return utils.templateResponse(data, HttpStatus.OK,  `Respuesta Controlada: El cliente ha sido creado correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método Crear cliente()`);
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
    atributoLogEntity.titulo = 'listar_clientes';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Listar clientes()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de listar clientes obtenidas correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.clienteRepository.findAll();
      return utils.templateResponse(data, HttpStatus.OK,  `Consulta de listar clientes obtenidas correctamente - Status: ${HttpStatus.OK}`,  `${this.SERVICIO} - Método Listar clientes()`);
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
    atributoLogEntity.titulo = 'consulta_cliente';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método buscar cliente()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de cliente ${id} obtenida correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.clienteRepository.findByPk(id);
      return utils.templateResponse(data, HttpStatus.OK,  `Consulta de cliente ${id} obtenida correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método buscar cliente()`);
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      atributoLogEntity.respuesta = `Error: ${error.message} - Status:${status}`;
      atributoLogEntity.estado = '0';
      atributoLogEntity.response = error;
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(error.message, status);
    }
    
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'actualizar_cliente';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método actualizar cliente()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Actualizar cliente ${id} guardada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.clienteRepository.update(updateClienteDto as any, { where: { id } });
      return utils.templateResponse(data, HttpStatus.OK,  `Actualizar cliente ${id} guardada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método actualizar cliente()`);
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
    atributoLogEntity.titulo = 'eliminar_cliente';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método eliminar cliente()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `El cliente ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.clienteRepository.destroy({ where: { id } });
      return utils.templateResponse(data, HttpStatus.OK,  `El cliente ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método eliminar cliente()`);
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