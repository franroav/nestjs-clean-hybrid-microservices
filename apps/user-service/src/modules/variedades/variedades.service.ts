import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVariedadeDto } from './dto/create-variedade.dto';
import { UpdateVariedadeDto } from './dto/update-variedade.dto';
import { Variedad } from './entities/variedade.entity';
import { Fruta } from '../frutas/entities/fruta.entity'; // Import the Fruta entity
import { InjectModel } from '@nestjs/sequelize';
import { AtributoLogEntity } from '../transaction-logs/entities/atributo-log.entity';
import { TransactionLogsService } from '../transaction-logs/services/transaction-logs.service';
import { Utils } from '../../../../../libs/shared/src/utils/utils.helper';
@Injectable()
export class VariedadesService {
  constructor(
    @InjectModel(Variedad)
    private variedadeRepository: typeof Variedad,
    private readonly transactionLogsService: TransactionLogsService,
    @InjectModel(Fruta)
    private readonly frutaModel: typeof Fruta, // Inject the Fruta model
  ) {}

  private readonly CODIGO_SERVICIO: string = 'X';
  private readonly SERVICIO: string = `Servicio - ${VariedadesService.name}`;

  findByName(nombre: string) {
    return this.variedadeRepository.findOne({ where: { nombre } });
  }

  async create(createVariedadeDto: CreateVariedadeDto) {
    const utils = new Utils();
    const { nombre, frutaId } = createVariedadeDto;
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'crear_variedad';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Crear Variedad()`;
    atributoLogEntity.inicio = Date.now();
    const exists = await this.findByName(createVariedadeDto['nombre']);
    if (exists) {
      atributoLogEntity.respuesta = `Respuesta Controlada: Variedad with this name already exists - Status: ${HttpStatus.CONFLICT}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(
        'Variedad with this name already exists',
        HttpStatus.CONFLICT,
      );
    }

    // Check if the Fruta with the given ID exists
    const existingFruta = await this.frutaModel.findByPk(frutaId);
    if (!existingFruta) {
      throw new HttpException(
        'Fruta with this ID does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      atributoLogEntity.respuesta = `Respuesta Controlada: La Variedad ha sido creada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.variedadeRepository.create(createVariedadeDto as any);
      return utils.templateResponse(data, HttpStatus.OK, `Respuesta Controlada: La Variedad ha sido creada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método Crear Variedad()`);
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
    atributoLogEntity.titulo = 'listar_Variadades';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método Listar Variedades()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de listar Variedades obtenidas correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.variedadeRepository.findAll();
      return utils.templateResponse(data, HttpStatus.OK,  `Consulta de listar Variedades obtenidas correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método Listar Variedades()`);
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
    atributoLogEntity.titulo = 'consulta_variedad';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método buscar Variedad()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Consulta de Variedad ${id} obtenida correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.variedadeRepository.findByPk(id);
      return utils.templateResponse(data, HttpStatus.OK, `Consulta de Variedad ${id} obtenida correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método buscar Variedad()`);
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      atributoLogEntity.respuesta = `Error: ${error.message} - Status:${status}`;
      atributoLogEntity.estado = '0';
      atributoLogEntity.response = error;
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      throw new HttpException(error.message, status);
    }
  }

  async update(id: number, updateVariedadeDto: UpdateVariedadeDto) {
    const utils = new Utils();
    const atributoLogEntity = new AtributoLogEntity();
    atributoLogEntity.uuid = this.transactionLogsService.generateUUID();
    atributoLogEntity.codigo = this.CODIGO_SERVICIO;
    atributoLogEntity.titulo = 'actualizar_variedad';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método actualizar Variedad()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `Actualizar Variedad ${id} guardada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.variedadeRepository.update(updateVariedadeDto as any, {
        where: { id },
      });
      return utils.templateResponse(data, HttpStatus.OK,  `Actualizar Variedad ${id} guardada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método actualizar Variedad()`);
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
    atributoLogEntity.titulo = 'eliminar_variedad';
    atributoLogEntity.lugar = `${this.SERVICIO} - Método eliminar Variedad()`;
    atributoLogEntity.inicio = Date.now();

    try {
      atributoLogEntity.respuesta = `La Variedad ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`;
      atributoLogEntity.estado = '1';
      this.transactionLogsService.transactionLogs(atributoLogEntity);
      const data = await this.variedadeRepository.destroy({ where: { id } });
      return utils.templateResponse(data, HttpStatus.OK,  `La Variedad ${id} ha sido eliminada correctamente - Status: ${HttpStatus.OK}`, `${this.SERVICIO} - Método eliminar Variedad()`);
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
