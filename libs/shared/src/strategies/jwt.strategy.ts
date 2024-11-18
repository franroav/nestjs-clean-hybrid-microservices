// src/modules/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@app/application/interfaces/auth/jwt-payload.interface' // './interfaces/jwt-payload.interface'; // Correct path to your interface

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_secret_key', // Replace with your JWT secret key
    });
  }

  async validate(payload: JwtPayload) {
    // Validate and return the user based on your application logic
    return { userId: payload.sub, username: payload.username };
  }
}


// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Types } from 'mongoose';
// import { TokenPayload } from '../auth.service';
// import { UsersService } from '../users/users.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     configService: ConfigService,
//     private readonly usersService: UsersService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request: any) => {
//           return request?.Authentication;
//         },
//       ]),
//       secretOrKey: configService.get('JWT_SECRET'),
//     });
//   }

//   async validate({ userId }: TokenPayload) {
//     try {
//       return await this.usersService.getUser({
//         _id: new Types.ObjectId(userId),
//       });
//     } catch (err) {
//       throw new UnauthorizedException();
//     }
//   }
// }
