import { Controller, Get } from '@nestjs/common';
import { CardServiceService } from './card-service.service';

@Controller()
export class CardServiceController {
  constructor(private readonly cardServiceService: CardServiceService) {}

  @Get()
  getHello(): string {
    return this.cardServiceService.getHello();
  }
}
