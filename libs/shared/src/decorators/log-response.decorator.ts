import { Inject, Logger } from '@nestjs/common';

export function LogResponse() {
  const injectLogger = Inject(Logger); // creates a function that injects a Logger into the decorated class

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectLogger(target, 'logger'); // this is the same as using constructor(private readonly logger: LoggerService) in a class
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      const logger: Logger = this.logger;
      logger.log(
        `[${target.constructor.name} - ${propertyKey}] Response:`,
        result,
      );
      return result;
    };

    return propertyDescriptor;
  };
}