import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import  moment from 'moment';
import { CustomHttpException } from './custom-http.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = 'Error en el sistema';
    let errorCode = null;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.error(`${exception}`);
    let jsonException = JSON.stringify(exception);
    if (jsonException === '{}') {
      message = exception.message;
    } else {
      message =
        JSON.parse(jsonException).message
          ? JSON.parse(jsonException).message
          : HttpStatus.INTERNAL_SERVER_ERROR;
    }
    if (exception.response !== undefined && exception.response.config !== undefined) {
      this.logger.error(`Error invocando al servicio: url=${exception.response.config.url}, code=${exception.response.status}, msg=${exception.response.statusText}`);
    }

    if(exception.response && exception.response.statusCode === HttpStatus.BAD_REQUEST) {
      this.logger.error(`Error de validacion del request. Response: ${JSON.stringify(exception.response)}`);
    }

    if (exception instanceof CustomHttpException) {
      message = null;
      errorCode = exception.getErrorCode();
    }

    response.status(status)
      .json({
        status,
        message,
        errorCode,
        timestamp: moment().format('DD-MM-YYYY HH:mm:ss'),
        path: request.url,
      });
  }
}