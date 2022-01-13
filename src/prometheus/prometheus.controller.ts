import { Controller, Get } from '@nestjs/common';
import { metric } from 'prom-client';
import { PrometheusService } from './prometheus.service';

@Controller('prometheus')
export class PrometheusController {
  constructor(private prometheusService: PrometheusService) {}

  @Get('/metrics')
  getMetrics(): Promise<string> {
    return this.prometheusService.getMetrics();
  }

  @Get('/metricsAsJson')
  getMetricsAsJson(): Promise<metric[]> {
    return this.prometheusService.getMetricsAsJson();
  }
}
