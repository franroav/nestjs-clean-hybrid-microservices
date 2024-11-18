
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../../../apps/user-service/src/modules/auth/auth.service' //'./apps/user-service/src/modules/auth/auth.service.ts';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email', // Assuming you use email as username
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-local';
// import { UsersService } from '../users/users.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly usersService: UsersService) {
//     super({ usernameField: 'email' });
//   }

//   async validate(email: string, password: string) {
//     return this.usersService.validateUser(email, password);
//   }
// }
