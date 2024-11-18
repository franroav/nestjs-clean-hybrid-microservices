import { Controller, Get, Post, Body, Patch, Scope, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { AgricultoresService } from './agricultores.service';
import { CreateAgricultoreDto } from './dto/create-agricultore.dto';
import { UpdateAgricultoreDto } from './dto/update-agricultore.dto';

import { agricultores } from '../../../../../libs/public/src/mocks/agricultor.mock';
import { request } from '../../../../../libs/public/src/mocks/mock';
import { TokenGuard } from '../../../../../libs/shared/src/guards/token.guard';


@Controller({
  path: 'agricultores',
  scope: Scope.REQUEST,
})
@ApiTags('agricultores')
export class AgricultoresController {
  constructor(private readonly agricultoresService: AgricultoresService) {}

  @ApiOperation({ summary: 'Ingresar agricultores' })
  @ApiBody({
    type: CreateAgricultoreDto,
    description: "Ingresar Agricultores.",
    examples: {
        a: {
            summary: "Mock Ingresar variedad de prueba.",
            description: "Mock para hacer pruebas de integracion",
            value: request
        },
        b: {
            summary: "Respuesta ingresar a ingresar variedad",
            description: "Mock con contenido en base64",
            value: agricultores
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
  create(@Body() createAgricultoreDto: CreateAgricultoreDto) {
    return this.agricultoresService.create(createAgricultoreDto);
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get()
  findAll() {
    return this.agricultoresService.findAll();
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agricultoresService.findOne(+id);
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgricultoreDto: UpdateAgricultoreDto) {
    return this.agricultoresService.update(+id, updateAgricultoreDto);
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agricultoresService.remove(+id);
  }
}
