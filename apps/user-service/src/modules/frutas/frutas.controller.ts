import { Controller, Get, Post, Body, Patch, Scope, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FrutasService } from './frutas.service';
import { CreateFrutaDto } from './dto/create-fruta.dto';
import { UpdateFrutaDto } from './dto/update-fruta.dto';

import { frutas } from '../../../../../libs/public/src/mocks/frutas.mock';
import { request } from '../../../../../libs/public/src/mocks/mock'
import { TokenGuard } from '../../../../../libs/shared/src/guards/token.guard';
@Controller({
  path: 'frutas',
  scope: Scope.REQUEST,
})
@ApiTags('frutas')
export class FrutasController {
  constructor(private readonly frutasService: FrutasService) {}

  @ApiOperation({ summary: 'Ingresar Frutas' })
  @ApiBody({
    type: CreateFrutaDto,
    description: "Ingresar frutas.",
    examples: {
        a: {
            summary: "Mock Ingresar variedad de prueba.",
            description: "Mock para hacer pruebas de integracion",
            value: request
        },
        b: {
            summary: "Respuesta ingresar a ingresar variedad",
            description: "Mock con contenido en base64",
            value: frutas
        },
    }
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post()
  create(@Body() createFrutaDto: CreateFrutaDto) {
    return this.frutasService.create(createFrutaDto);
  }

  // @ApiResponse({
  //   status: 201,
  //   type: ApiResponseFrutas,
  // })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get()
  findAll() {
    return this.frutasService.findAll();
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frutasService.findOne(+id);
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFrutaDto: UpdateFrutaDto) {
    return this.frutasService.update(+id, updateFrutaDto);
  }
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frutasService.remove(+id);
  }
  
}
