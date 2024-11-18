import { Controller, Get, Post, Body, Patch, Scope, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';


import { clientes } from '../../../../../libs/public/src/mocks/clientes.mock';
import { request } from '../../../../../libs/public/src/mocks/mock'
import { TokenGuard } from '../../../../../libs/shared/src/guards/token.guard';
@Controller({
  path: 'clientes',
  scope: Scope.REQUEST,
})
@ApiTags('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiOperation({ summary: 'Ingresar clientes' })
  @ApiBody({
    type: CreateClienteDto,
    description: "Ingresar clientes.",
    examples: {
        a: {
            summary: "Mock Ingresar clientes de prueba.",
            description: "Mock para hacer pruebas de integracion",
            value: request
        },
        b: {
            summary: "Respuesta ingresar clientes",
            description: "Mock con contenido en base64",
            value: clientes
        },
      //   c: {
      //     summary: "Respuesta ingresar solicitud de documentos",
      //     description: "Mock con respuesta del servicio",
      //     value: responseIngresarDocumentosMock
      // }
    }
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get()
  findAll() {
    return this.clientesService.findAll();
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}
