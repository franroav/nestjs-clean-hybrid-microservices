import { BadRequestException } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({ points: 10, duration: 1 }); // 10 requests per second

export function RateLimit() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        await rateLimiter.consume(args[0].ip); // assuming IP is in args[0]
        return await originalMethod.apply(this, args);
      } catch (rejRes) {
        throw new BadRequestException('Too many requests');
      }
    };
    return descriptor;
  };
}