import { Injectable } from '@nestjs/common';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

@Injectable()
export class ApiGatewayAdapter {
  private apiGatewayClient: ApiGatewayManagementApiClient;

  constructor() {
    // Configure the API Gateway Management API client
    this.apiGatewayClient = new ApiGatewayManagementApiClient({
      region: process.env.AWS_REGION, // e.g., 'us-east-1'
      endpoint: process.env.API_GATEWAY_ENDPOINT, // The endpoint of your API Gateway
    });
  }

  async postToConnection(connectionId: string, data: string): Promise<void> {
    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: Buffer.from(data), // Convert data to Buffer
    });

    try {
      await this.apiGatewayClient.send(command);
    } catch (error) {
      console.error('Failed to send data to connection:', error);
      throw error;
    }
  }
}
