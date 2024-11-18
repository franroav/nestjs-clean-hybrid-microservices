/* istanbul ignore file */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly jwtServ: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Implement your authentication logic here
    if (
      process.env.DESACTIVAR_VALIDACION_RUT_TOKEN &&
      JSON.parse(process.env.DESACTIVAR_VALIDACION_RUT_TOKEN)
    ) {
      return true;
    }

    //Por ahora solo se valida que exista un authorization header
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }

    return true;
  }
}

export function UseAuthGuard() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Apply guard to method
  };
}