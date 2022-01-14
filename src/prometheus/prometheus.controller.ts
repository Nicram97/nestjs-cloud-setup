import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { metric } from 'prom-client';
import { PrometheusService } from './prometheus.service';

@Controller('prometheus')
export class PrometheusController {
  constructor(private prometheusService: PrometheusService) {}

  @ApiOperation({ summary: 'getMetrics' })
  @ApiOkResponse({
    status: 200,
    description: 'Return Prometheus metrics as string',
  })
  @Get('/metrics')
  getMetrics(): Promise<string> {
    return this.prometheusService.getMetrics();
  }

  @ApiOperation({ summary: 'getMetricsAsJson' })
  @ApiOkResponse({
    status: 200,
    description: 'Return Prometheus metrics as json',
  })
  @Get('/metricsAsJson')
  getMetricsAsJson(): Promise<metric[]> {
    return this.prometheusService.getMetricsAsJson();
  }
}
