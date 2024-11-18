import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import CircuitBreaker from 'opossum';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CircuitBreakerInterceptor.name);
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    const options = {
      timeout: 3000,  // Function timeout
      errorThresholdPercentage: 50,  // Percentage of failed requests
      resetTimeout: 10000,  // Reset after 10 seconds
    };

    this.circuitBreaker = new CircuitBreaker(this.execute.bind(this), options);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    this.logger.log(`Executing request ${url}`);

    return from(this.circuitBreaker.fire(next.handle().toPromise())).pipe(
      tap(() => this.logger.log(`Request succeeded ${url}`)),
      catchError((error) => {
        console.log("interceptor error", error)
        this.logger.error(`Error caught in interceptor ${url}`, error);
        return throwError(() => new HttpException('Service unavailable. Please try again later.', HttpStatus.SERVICE_UNAVAILABLE));
      })
    );
  }

  private async execute(promise: Promise<any>) {
    return await promise;
  }
}