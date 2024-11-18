import { Logger, LogLevel } from '@nestjs/common';

export function LogExecutionTime(logLevel: LogLevel = 'log'): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      Logger[logLevel](`Called ${propertyKey} with args: ${JSON.stringify(args)}`);
      const result = await originalMethod.apply(this, args);
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      Logger[logLevel](`Result from ${propertyKey}: ${JSON.stringify(result)} execution time: ${executionTime}ms`, target.constructor.name);
      return result;
    };
    return descriptor;
  };
}
