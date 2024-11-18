import { Injectable } from '@nestjs/common';
import { Registry, collectDefaultMetrics, Gauge } from 'prom-client';

@Injectable()
export class PrometheusService {

  private readonly registry: Registry;
  private readonly customGauge: Gauge<string>;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });

    // Create a custom gauge metric
    this.customGauge = new Gauge({
      name: 'custom_metric_gauge',
      help: 'Custom metric gauge help text',
      registers: [this.registry],
    });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  setCustomGaugeValue(value: number): void {
    this.customGauge.set(value);
  }
}
