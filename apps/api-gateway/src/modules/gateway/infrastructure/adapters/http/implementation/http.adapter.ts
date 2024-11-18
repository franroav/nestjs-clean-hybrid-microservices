import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HttpAdapter {
  constructor(private readonly httpService: HttpService) {}

  async makeRequest(url: string, method: string, body?: any): Promise<any> {
    try {
      const response: any = await lastValueFrom(
        this.httpService.request({
          url,
          method,
          data: body,
        })
      );
      return response.data;
    } catch (error) {
      console.error('HTTP Request failed:', error);
      throw error;
    }
  }
}
