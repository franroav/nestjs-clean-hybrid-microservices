import {
  Controller,
  Post,
  Body,
  Scope,
  UseGuards,
  UseInterceptors,
  Logger,
  Get,
  Param,
  Query,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GatewayService } from '../../application/services/gateway.service';
import { RequestDto } from '../../domain/dto/request.dto';
import { ApiResponse as CustomApiResponse } from '../../domain/models/api-response.model';
import { TokenGuard } from '../../../../../../../libs/shared/src/guards/token.guard';
import { CircuitBreakerInterceptor } from '../../../../../../../libs/shared/src/interceptors/circuit-breaker.interceptor';
import { AuthService } from '../../../auth/auth.service';
import { CreateAuthDto } from '../../../auth/dto/create-auth.dto';

@Controller({
  path: 'gateway',
  scope: Scope.REQUEST,
})
@ApiTags('gateway')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Route a request to a specific microservice',
    description:
      'This endpoint forwards requests to designated microservices based on the service name and path provided in the request body.',
  })
  @ApiBody({
    type: RequestDto,
    description: 'The data required to route the request to a microservice.',
    examples: {
      example1: {
        summary: 'Example routing request',
        description: 'A sample request body for routing.',
        value: {
          serviceName: 'user-service',
          path: '/users',
          method: 'POST',
          body: {
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @UseInterceptors(CircuitBreakerInterceptor)
  @Post('route')
  @ApiResponse({
    status: 200,
    description: 'Request successfully routed to the microservice.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        data: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async route(@Body() requestDto: RequestDto): Promise<CustomApiResponse> {
    try {
      const data = await this.gatewayService.routeRequest(
        requestDto.serviceName,
        requestDto.path,
        requestDto.method,
        requestDto.body,
      );
      return { statusCode: 200, data };
    } catch (error) {
      this.logger.error('Error routing request', error.stack);
      return { statusCode: 500, data: 'Internal Server Error' };
    }
  }

  @ApiOperation({ summary: 'Ping endpoint to check service availability' })
  @ApiResponse({ status: 200, description: 'Service is up and running.' })
  @Get('ping')
  ping(): string {
    this.logger.log('Ping request received');
    return 'Service is up and running!';
  }

  @ApiOperation({ summary: 'Authenticate user and return JWT token' })
  @ApiResponse({ status: 201, description: 'User authenticated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('auth/login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.authService.validateUser(
      createAuthDto.username,
      createAuthDto.password,
    );
    if (!user) {
      this.logger.warn('Invalid user credentials');
      throw new UnauthorizedException('Invalid credentials');
    }
    this.logger.log('User authenticated successfully');
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Retrieve data from a specific microservice' })
  @ApiResponse({ status: 200, description: 'Data retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Data not found.' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the data to retrieve',
  })
  @UseGuards(AuthGuard('jwt')) // Protect route with JWT authentication
  @Get('data/:id')
  async getData(@Param('id') id: string, @Query('filter') filter?: string) {
    this.logger.log(`Fetching data with ID: ${id}`);
    const data = await this.gatewayService.fetchData(id, filter);
    if (!data) {
      this.logger.warn(`Data with ID ${id} not found`);
      throw new NotFoundException('Data not found');
    }
    this.logger.log(`Data with ID ${id} retrieved successfully`);
    return data;
  }
}



// import { Controller, Post, Body } from '@nestjs/common';
// import { GatewayService } from '../../application/services/gateway-proxy.service';
// import { ApiGatewayRequest } from '../../domain/models/api-gateway-request.model';
// import { ApiGatewayResponse } from '../../domain/models/api-gateway-response.model';

// @Controller('gateway')
// export class GatewayController {
//   constructor(private readonly gatewayService: GatewayService) {}

//   @Post('send')
//   async sendData(@Body() request: ApiGatewayRequest): Promise<ApiGatewayResponse> {
//     return this.gatewayService.handleRequest(request);
//   }
// }
