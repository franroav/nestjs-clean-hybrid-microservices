export interface ApiGatewayPort {
    routeRequest(serviceName: string, path: string, method: string, body?: any): Promise<any>;
  }
  