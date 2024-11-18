import { Injectable } from '@nestjs/common';
import { ApiGatewayRequest,  } from '../../domain/models/api-gateway-request.model';
import {  ApiGatewayResponse } from '../../domain/models/api-gateway-response.model';
import { ApiGatewayAdapter } from '../../infrastructure/adapters/aws/apigateway.adapter';

@Injectable()
export class GatewayService {
  constructor(private readonly apiGatewayAdapter: ApiGatewayAdapter) {}

  async handleRequest(request: ApiGatewayRequest): Promise<ApiGatewayResponse> {
    try {
      await this.apiGatewayAdapter.postToConnection(request.connectionId, request.data);
      return {
        statusCode: 200,
        message: 'Data sent successfully',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to send data',
      };
    }
  }
}

// import { Injectable, HttpService } from '@nestjs/common';

// @Injectable()
// export class GatewayProxyService {
//   constructor(private readonly httpService: HttpService) {}

//   async proxyRequest(url: string, method: string, data: any = null, headers: any = {}): Promise<any> {
//     try {
//       const response = await this.httpService.request({
//         url,
//         method,
//         data,
//         headers,
//       }).toPromise();
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   }
// }
