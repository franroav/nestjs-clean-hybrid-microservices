// apps\user-service\src\modules\users\user.controller.ts
import { Controller, Get, Param, Post, Body, HttpException, Logger, HttpStatus, UseInterceptors, UsePipes, UploadedFiles, UseFilters, UseGuards  } from '@nestjs/common';
import { UserService } from './user.service';
import { CircuitBreakerInterceptor } from '@app/shared/interceptors/circuit-breaker.interceptor';
import { CacheKey, CacheTTL,  } from '@nestjs/cache-manager';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TokenGuard } from '@app/shared/guards/token.guard';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService
  ) {}

  @Post()//
  // @ApiBearerAuth()
  // @CacheKey('NUEVO_USUARIO')
  // @CacheTTL(60) // Cache this route for 60 seconds
  // @UseGuards(TokenGuard)
  // // @UsePipes(new UpperCasePipe())
  // @UseInterceptors(CircuitBreakerInterceptor)
  // Use the controller level for simpler, more uniform use across many methods.
  async newUser(@Body() body: any): Promise<any> {
    try {
      this.logger.log('Processing new user', body);
      console.log("1° safe controller", body)
      const { name, email, password } = body
      return await this.userService.createUser(name, email, password );
    } catch (error: any) {
      console.log("error ", error)
      this.logger.error('Error processing user event', error);
      throw new HttpException( `${error['response']}` || `${error['stack']}`,  error['status'] || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()//
  // @ApiBearerAuth()
  // @CacheKey('READ_USUARIO')
  // @CacheTTL(60) // Cache this route for 60 seconds
  // @UseGuards(TokenGuard)
  // // @UsePipes(new UpperCasePipe())
  // @UseInterceptors(CircuitBreakerInterceptor)

  async readUser(@Body() body: any): Promise<any> {
    try {
      this.logger.log('Processing read user', body);
      console.log("1° read controller", body)
      const { name, email } = body
      return await this.userService.findUser(body);
    } catch (error) {
      console.log("error ", error)
      this.logger.error('Error processing user read event', error);
      throw new HttpException('Error processing user read event', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}


  // @Post()
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.createUserUseCase.execute(createUserDto.name, createUserDto.email);
  // }

  // @Get(':id')
  // async findUser(@Param('id') id: string) {
  //   console.log("1° step", "1° step");
  //   return this.findUserUseCase.execute(id);
  // }