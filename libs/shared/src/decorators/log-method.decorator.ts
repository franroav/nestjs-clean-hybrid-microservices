import { Logger } from '@nestjs/common';

export function LogMethod() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      Logger.log(`Method: ${propertyKey}, Params: ${JSON.stringify(args)}`, target.constructor.name);
      return await originalMethod.apply(this, args);
    };
    return descriptor;
  };
}