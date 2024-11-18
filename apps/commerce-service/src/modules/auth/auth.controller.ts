import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Scope } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from '../../../../../libs/shared/src/guards/local-auth.guard';
import { UserLogin } from './interfaces/user-login.interface';


@ApiTags('auth')
@Controller({
  path: 'auth',
  scope: Scope.REQUEST,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: CreateAuthDto,
    description: "Ingresar Login.",
    examples: {
        a: {
            summary: "Mock Ingresar Login de prueba.",
            description: "Mock para hacer pruebas de integracion",
            value: {email:'admin', password: 'password'}
        },
        // b: {
        //     summary: "Respuesta ingresar a ingresar variedad",
        //     description: "Mock con contenido en base64",
        //     value: agricultores
        // },
      //   c: {
      //     summary: "Respuesta ingresar solicitud de documentos",
      //     description: "Mock con respuesta del servicio",
      //     value: responseIngresarDocumentosMock
      // }
    }
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: UserLogin) {
    return this.authService.login(body);
  }

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
