import { EventEmitter2 } from 'eventemitter2';

const eventEmitter = new EventEmitter2();

export function EmitEvent(event: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      eventEmitter.emit(event, result);
      return result;
    };
    return descriptor;
  };
}
