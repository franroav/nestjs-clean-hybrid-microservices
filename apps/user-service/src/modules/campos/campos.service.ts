import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCampoDto } from './dto/create-campo.dto';
import { UpdateCampoDto } from './dto/update-campo.dto';
import { Campo } from './entities/campo.entity';
import { InjectModel } from '@nestjs/sequelize';
import { AtributoLogEntity } from '../transaction-logs/entities/atributo-log.entity';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { Utils } from '../../../../../libs/shared/src/utils/utils.helper';

@Injectable()
export class CamposService {
  constructor(
    @InjectModel(Campo)
    private campoRepository: any, // typeof Campo,
    private readonly transactionLogsService: TransactionLogsService,
  ) {}

  private readonly CODIGO_SERVICIO: string = 'X';
  private readonly SERVICIO: string = `Servicio - ${CamposService.name}`;

  findByNameAndLocation(nombre: string, ubicacion: string) {
    return this.campoRepository.findOne({ where: { nombre, ubicacion } });
  }

  async create(createCampoDto: CreateCampoDto) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'crear_campo';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Crear campo()`;
    atributoLogEntity.inicio = Date.now();
    const exists = await this.findByNameAndLocation(createCampoDto['nombre'], createCampoDto['ubicacion']);
    if (exists) {
      atributoLogEntity.respuesta = `Respuesta Controlada: Campo with this name and location already exists for campo - Status: ${HttpStatus.CONFLICT}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException('Campo with this name and location already exists', HttpStatus.CONFLICT);
    }


    try {
      atributoLogEntity.respuesta = `El campo ha sido creada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.campoRepository.create(createCampoDto as any);
      return utils.templateResponse(data, HttpStatus.OK, `El campo ha sido creada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método Crear campo()`);
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
    atributoLogEntity.titulo = 'listar_campos';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Listar campos()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de listar campos obtenidas correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.campoRepository.findAll();
      return utils.templateResponse(data, HttpStatus.OK, `Consulta de listar campos obtenidas correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método Listar campos()`);
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
    atributoLogEntity.titulo = 'consulta_campo';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método buscar campo()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de campo ${id} obtenida correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.campoRepository.findByPk(id);
      return utils.templateResponse(data, HttpStatus.OK, `Consulta de campo ${id} obtenida correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método buscar campo()`);
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      atributoLogEntity.respuesta = `Error: ${error.message} - Status:${status}`;
      atributoLogEntity.estado = '0';
      atributoLogEntity.response = error;
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(error.message, status);
    }
    
  }

  async update(id: number, updateCampoDto: UpdateCampoDto) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'actualizar_campo';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método actualizar campo()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Actualizar campo ${id} guardada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.campoRepository.update(updateCampoDto as any, { where: { id } });
      return utils.templateResponse(data, HttpStatus.OK, `Actualizar campo ${id} guardada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método actualizar campo()`);
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
    atributoLogEntity.titulo = 'eliminar_campo';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método eliminar campo()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `El campo ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.campoRepository.destroy({ where: { id } });
      return utils.templateResponse(data, HttpStatus.OK, `El campo ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método eliminar campo()`);
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