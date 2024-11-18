import { Injectable } from '@nestjs/common';
import { ApiGatewayPort } from '../ports/api-gateway.port';
import { HttpAdapter } from '../../infrastructure/adapters/http/implementation/http.adapter';

@Injectable()
export class GatewayService implements ApiGatewayPort {
  constructor(private readonly httpAdapter: HttpAdapter) {}

  async routeRequest(serviceName: string, path: string, method: string, body?: any): Promise<any> {
    // You can add logic to determine the URL based on the service name
    const serviceUrl = this.getServiceUrl(serviceName);

    if (!serviceUrl) {
      throw new Error(`Service ${serviceName} not found`);
    }

    return this.httpAdapter.makeRequest(serviceUrl + path, method, body);
  }

  private getServiceUrl(serviceName: string): string | null {
    // Map service names to their URLs (these could come from environment variables or a config file)
    const serviceMap = {
      'user-service': process.env.USER_SERVICE_URL,
      'order-service': process.env.ORDER_SERVICE_URL,
    };

    return serviceMap[serviceName] || null;
  }
}
