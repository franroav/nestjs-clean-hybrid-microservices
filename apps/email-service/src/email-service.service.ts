import { Injectable, OnModuleInit } from '@nestjs/common';
// import { Consul } from 'consul';
@Injectable()
export class EmailService {
  // private consul = new Consul();

  // async OnModuleInit() {
  //   await this.registerService();
  // }

  sendMessage(data: any): any {
    console.log('Este es el evento entrante', data)
  }
  getHello(): string {
    return 'Hola soy el microservico MAIL';
  }

  // async registerService() {
  //   await this.consul.agent.service.register({
  //     id: 'email-service',
  //     service: 'email-service',
  //     address: 'email-service', // use service name or specific IP
  //     port: 3003, // service port
  //     check: {
  //       http: 'http://email-service:3003/health', // health check endpoint
  //       interval: '10s',
  //     },
  //   });
  // }
}
