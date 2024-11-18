// apps\user-service\src\modules\users\user.service.ts

import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserUseCase } from '@app/application/usecases/users/create-user.use-case';
import { FindUserUseCase } from '@app/application/usecases/users/find-user.use-case';
import { ClientProxy } from '@nestjs/microservices';
import CircuitBreaker from 'opossum';  // Correct Import
import { CircuitBreakerInterceptor } from '@app/shared/interceptors/circuit-breaker.interceptor'
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@app/domain/entities/users/mongoose/schemas/user.schema';

export interface TokenPayload {
  userId: string;
}

// /**
//  * Defines the base Nest HTTP exception, which is handled by the default
//  * Exceptions Handler.
//  *
//  * @see [Built-in HTTP exceptions](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)
//  *
//  * @publicApi
//  */

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);
  private readonly emailCircuitBreaker: CircuitBreaker<any>;
    //  /**
    //  * Instantiate a plain HTTP Exception.
    //  *
    //  * @example
    //  * throw new HttpException('message', HttpStatus.BAD_REQUEST)
    //  * throw new HttpException('custom message', HttpStatus.BAD_REQUEST, {
    //  *  cause: new Error('Cause Error'),
    //  * })
    //  *
    //  *
    //  * @usageNotes
    //  * The constructor arguments define the response and the HTTP response status code.
    //  * - The `response` argument (required) defines the JSON response body. alternatively, it can also be
    //  *  an error object that is used to define an error [cause](https://nodejs.org/en/blog/release/v16.9.0/#error-cause).
    //  * - The `status` argument (required) defines the HTTP Status Code.
    //  * - The `options` argument (optional) defines additional error options. Currently, it supports the `cause` attribute,
    //  *  and can be used as an alternative way to specify the error cause: `const error = new HttpException('description', 400, { cause: new Error() });`
    //  *
    //  * By default, the JSON response body contains two properties:
    //  * - `statusCode`: the Http Status Code.
    //  * - `message`: a short description of the HTTP error by default; override this
    //  * by supplying a string in the `response` parameter.
    //  *
    //  * To override the entire JSON response body, pass an object to the `createBody`
    //  * method. Nest will serialize the object and return it as the JSON response body.
    //  *
    //  * The `status` argument is required, and should be a valid HTTP status code.
    //  * Best practice is to use the `HttpStatus` enum imported from `nestjs/common`.
    //  *
    //  * @param response string, object describing the error condition or the error cause.
    //  * @param status HTTP response status code.
    //  * @param options An object used to add an error cause.
    //  */

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  

  async createUser(name: string, email: string, password: string) {
    return this.createUserUseCase.execute(name, email, password);
  }

  async findUser(email: string) {
    return this.findUserUseCase.execute(email);
  }

  // @UseInterceptors(CircuitBreakerInterceptor) // Apply interceptor at the method level
  // async newUser(user: any): Promise<string> {
  //   this.logger.log('New user creation started');

  //   // First, send user event
  //   try {
  //     this.logger.log('Sending user event');
  //     await this.userService.emit('new_user', user).toPromise();
  //     this.logger.log('User event sent successfully');
  //   } catch (err: any) {
  //     const errorTemplate: any = {};
  //     const errorKeys = typeof err === 'object' ? Object.keys(err['errors'][0]) : [];
      
  //     if (errorKeys.length) {
  //       for (let key of errorKeys) {
  //         errorTemplate[key] = err['errors'][0][key];
  //       }

  //       this.logger.error('Error sending user event', {
  //         error: err['message'],
  //         code: err['code'],
  //         stack: err['stack'],
  //         user,
  //         ...errorTemplate,
  //       });

  //       const detailedMessage = `Error sending user event: ${errorTemplate['code']} - ${errorTemplate['syscall']} - ${errorTemplate['address']}:${errorTemplate['port']}`;
  //       throw new HttpException(detailedMessage, HttpStatus.SERVICE_UNAVAILABLE);
  //     } else {
  //       this.logger.error('Error sending user event', {
  //         error: err['message'],
  //         code: err['code'],
  //         stack: err['stack'],
  //         user,
  //         ...errorTemplate,
  //       });

  //       throw new HttpException('Error sending user event', HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }

  //   // Use Circuit Breaker for email service through the interceptor
  //   try {
  //     await this.sendEmail(user); // sendEmail method call without direct CircuitBreaker
  //     this.logger.log('Email event processed successfully');
  //   } catch (err: any) {
  //     this.logger.error('Error processing email event', {
  //       error: err['message'],
  //       code: err['code'],
  //       stack: err['stack'],
  //       user,
  //     });
  //     throw new HttpException('Error sending email event', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }

  //   this.logger.log('All events processed successfully');
  //   return 'Events sent to queues';
  // }

  // private async sendEmail(user: any) {
  //   try {
  //     this.logger.log('Sending mail event');
  //     await this.clientMail.emit('new_mail', user).toPromise();
  //     this.logger.log('Mail event sent successfully');
  //   } catch (err: any) {
  //     this.logger.error('Mail service failed', {
  //       error: err['message'],
  //       code: err['code'],
  //       stack: err['stack'],
  //       user,
  //     });
  //     throw err; // Rethrow to be caught by the Circuit Breaker
  //   }
  // }

  // async newUser(user: any): Promise<string> {
  //   this.logger.log('New user creation started');

  //   // First, send user event
  //   try {
  //     this.logger.log('Sending user event');
  //     await this.userService.emit('new_user', user).toPromise();
  //     this.logger.log('User event sent successfully');
  //   } catch (err: any) {
  //     // console.log("error user event", typeof err)
  //     // console.log("error user event", err['code'])
  //     // console.log("error user event", err['[errors]'])
  //     // console.log("error user event", err['errors'].length)
  //     // console.log("errors ", err['errors'][0])
  //     // console.log("errors ", Object.keys(err['errors'][0]))
  //     // console.log("errors ", err['errors'][0]['errno'])
  //     // console.log("errors ", err['errors'][0]['code'])
  //     // console.log("errors ", err['errors'][0]['syscall'])
  //     // console.log("errors ", err['errors'][0]['address'])
  //     // console.log("errors ", err['errors'][0]['port'])
  //     let errorTemplate: any = {}
  //     const errorKeys = typeof err === 'object' ? Object.keys(err['errors'][0]) : []
  //     // console.log("errorTemplate", errorTemplate)
  //     // console.log("errors ", errorKeys)
  //     // errorKeys.length > 0 ? 
  //     if(errorKeys.length){
  //       for (let Key of errorKeys) {
  //         errorTemplate[Key] = err['errors'][0][Key]
  //       }

  //       this.logger.error('Error sending user event', {
  //         error: err['message'],
  //         code: err['code'],
  //         stack: err['stack'],
  //         user,
  //         ...errorTemplate
  //       });

  //       // Throw HttpException with detailed error message
  //       const detailedMessage = `Error sending user event: ${errorTemplate['code']} - ${errorTemplate['syscall']} - ${errorTemplate['address']}:${errorTemplate['port']}`;
  //       throw new HttpException(detailedMessage, HttpStatus.SERVICE_UNAVAILABLE);
  //     } else {
  //       this.logger.error('Error sending user event', {
  //         error: err['message'],
  //         code: err['code'],
  //         stack: err['stack'],
  //         user,
  //         ...errorTemplate
  //       });

  //       throw new HttpException('Error sending user event', HttpStatus.INTERNAL_SERVER_ERROR);

  //     } 
     
  //   }

  //   // Use Circuit Breaker for email service
  //   try {
  //     await this.emailCircuitBreaker.fire(user);
  //     this.logger.log('Email event processed successfully');
  //   } catch (err: any) {

  //     this.logger.error('Error processing email event', {
  //       error: err['message'],
  //       code: err['code'],
  //       stack: err['stack'],
  //       user
  //     });
  //     throw new HttpException('Error sending email event', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }

  //   this.logger.log('All events processed successfully');
  //   return 'Events sent to queues';
  // }

  // private async sendEmail(user: any) {
  //   try {
  //     this.logger.log('Sending mail event');
  //     await this.clientMail.emit('new_mail', user).toPromise();
  //     this.logger.log('Mail event sent successfully');
  //   } catch (err: any) {
  //     this.logger.error('Mail service failed', {
  //       error: err['message'],
  //       code: err['code'],
  //       stack: err['stack'],
  //       user
  //     });
  //     throw err; // Rethrow to be caught by Circuit Breaker
  //   }
  // }
  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: (user._id as any).toHexString(), // Type assertion to avoid the error
    };
  
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
  
    const token = this.jwtService.sign(tokenPayload);
  
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
