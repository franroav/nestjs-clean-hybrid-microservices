import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';

@Controller('prometheus')
export class PrometheusController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get()
  async getMetrics(): Promise<string> {
    return await this.prometheusService.getMetrics();
  }

}
