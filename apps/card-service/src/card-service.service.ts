import { Injectable } from '@nestjs/common';

@Injectable()
export class CardServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
