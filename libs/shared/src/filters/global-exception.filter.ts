/* istanbul ignore file */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionsFilters implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: any = null;
    console.log("exception", exception)
    if (exception instanceof HttpException) {
      if (
        exception.getStatus() == HttpStatus.FORBIDDEN ||
        exception.getStatus() == HttpStatus.BAD_REQUEST ||
        exception.getStatus() == HttpStatus.SERVICE_UNAVAILABLE ||
        exception.getStatus() == HttpStatus.NOT_ACCEPTABLE ||
        exception.getStatus() == HttpStatus.EXPECTATION_FAILED ||
        exception.getStatus() == HttpStatus.UNAUTHORIZED ||
        exception.getStatus() == HttpStatus.REQUEST_TIMEOUT ||
        exception.getStatus() == HttpStatus.BAD_GATEWAY ||
        exception.getStatus() == HttpStatus.GATEWAY_TIMEOUT ||
        exception.getStatus() == HttpStatus.EXPECTATION_FAILED ||
        exception.getStatus() == HttpStatus.NOT_FOUND ||
        exception.getStatus() == HttpStatus.CONFLICT
      ) {
        status = exception.getStatus();
        error = exception.message;

      } else {
        error = 'Error interno del servidor';
      }
    } else {
      error = 'Error interno del servidor';
    }

    if (response.status) {
      response.status(status).json({
        statusCode: status,
        error: error || '',
        timestamp: new Date().toDateString(),
        path: request.url,
      });
    }
  }
}
