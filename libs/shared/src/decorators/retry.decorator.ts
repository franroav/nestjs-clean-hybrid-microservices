import { InternalServerErrorException } from '@nestjs/common';

export function Retry(times: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      for (let i = 0; i < times; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          if (i === times - 1) {
            throw new InternalServerErrorException('Operation failed after retries');
          }
        }
      }
    };
    return descriptor;
  };
}
