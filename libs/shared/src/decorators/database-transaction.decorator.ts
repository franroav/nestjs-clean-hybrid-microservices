
// Purpose: Wraps methods in a database transaction, ensuring that all operations within the method succeed or fail together.
import { Transactional } from 'typeorm-transactional-cls-hooked';

export function TransactionalMethod() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    return Transactional()(target, propertyKey, descriptor);
  };
}