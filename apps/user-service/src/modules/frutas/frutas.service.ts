import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFrutaDto } from './dto/create-fruta.dto';
import { UpdateFrutaDto } from './dto/update-fruta.dto';
import { Fruta } from './entities/fruta.entity';
import { InjectModel } from '@nestjs/sequelize';
import { AtributoLogEntity } from '../transaction-logs/entities/atributo-log.entity';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { Utils } from '../../../../../libs/shared/src/utils/utils.helper';
@Injectable()
export class FrutasService {
  constructor(
    @InjectModel(Fruta)
    private frutaRepository: typeof Fruta,
    private readonly transactionLogsService: TransactionLogsService,
  ) {}

  private readonly CODIGO_SERVICIO: string = 'X';
  private readonly SERVICIO: string = `Servicio - ${FrutasService.name}`;

  findByName(nombre: string) {
    return this.frutaRepository.findOne({ where: { nombre } });
  }

  async create(createFrutaDto: CreateFrutaDto) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'crear_fruta';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Crear Fruta()`;
    atributoLogEntity.inicio = Date.now();

    const exists = await this.findByName(createFrutaDto['nombre']);
    if (exists) {
      atributoLogEntity.respuesta = `Respuesta Controlada: Fruta with this name already exists - Status: ${HttpStatus.CONFLICT}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(
        'Fruta with this name already exists',
        HttpStatus.CONFLICT,
      );
    }

    try {
      atributoLogEntity.respuesta = `La fruta ha sido creada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.frutaRepository.create(createFrutaDto as any)
      return utils.templateResponse(data, HttpStatus.OK, `La fruta ha sido creada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método Crear Fruta()`);
      // return this.frutaRepository.create(createFrutaDto as any);
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
    atributoLogEntity.titulo = 'listar_frutas';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Listar Frutas()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de listar Frutas obtenidas correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.frutaRepository.findAll()
      return utils.templateResponse(data, HttpStatus.OK, `Consulta de listar Frutas obtenidas correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método Listar Frutas()`);
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
    atributoLogEntity.titulo = 'consulta_fruta';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método buscar Fruta()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de Fruta ${id} obtenida correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.frutaRepository.findByPk(id);
      return utils.templateResponse(data, HttpStatus.OK, `Consulta de Fruta ${id} obtenida correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método buscar Fruta()`);
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      atributoLogEntity.respuesta = `Error: ${error.message} - Status:${status}`;
      atributoLogEntity.estado = '0';
      atributoLogEntity.response = error;
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(error.message, status);
    }
  }

 async update(id: number, updateFrutaDto: UpdateFrutaDto) {
  const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'actualizar_fruta';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método actualizar Fruta()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Actualizar Fruta ${id} guardada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.frutaRepository.update(updateFrutaDto as any, {
        where: { id },
      });
      return utils.templateResponse(data, HttpStatus.OK, `Actualizar Fruta ${id} guardada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método actualizar Fruta()`);
      
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
    atributoLogEntity.titulo = 'eliminar_fruta';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método eliminar Fruta()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `La Fruta ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.frutaRepository.destroy({ where: { id } });
      return utils.templateResponse(data, HttpStatus.OK, `La Fruta ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método eliminar Fruta()`);
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
