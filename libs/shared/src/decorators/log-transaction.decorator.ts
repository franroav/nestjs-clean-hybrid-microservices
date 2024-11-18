import { Logger } from '@nestjs/common';

export function TransactionLogger() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      Logger.log(`Transaction processed: ${JSON.stringify(result)}`, target.constructor.name);
      return result;
    };
    return descriptor;
  };
}