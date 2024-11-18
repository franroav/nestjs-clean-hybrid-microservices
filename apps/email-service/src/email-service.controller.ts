import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email-service.service';
import { EventPattern, MessagePattern, Ctx, Transport, Payload, NatsContext,    } from '@nestjs/microservices';

@Controller()
export class EmailServiceController {
  constructor(private readonly emailServiceService: EmailService) {}

  @Get()
  getHello(): string {
    return this.emailServiceService.getHello();
  }

  @Get('health')
  healthCheck() {
    return { status: 'healthy' };
  }

  @EventPattern('new_mail')
  handleNewEmail(data:any){
    console.log('Received new mail event:', data); // Add logging
   return this.emailServiceService.sendMessage(data)
  }
}
