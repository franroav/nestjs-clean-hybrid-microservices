import { Inject, Logger } from '@nestjs/common';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

export function HandleError() {
  const injectErrorHandlerService = Inject(ErrorHandlerService); // creates a function that injects a Logger into the decorated class

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectErrorHandlerService(target, 'errorHandlerService'); // this is the same as using constructor(private readonly logger: LoggerService) in a class
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof Error) {
          const errorHandlerService: ErrorHandlerService =
            this.errorHandlerService;
          errorHandlerService.handle(error);
        }
        throw error;
      }
    };

    return propertyDescriptor;
  };
}