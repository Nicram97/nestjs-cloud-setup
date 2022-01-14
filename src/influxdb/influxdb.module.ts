import { Module } from '@nestjs/common';
import { PrometheusModule } from '../prometheus/prometheus.module';
import { InfluxService } from './influxdb.service';

@Module({
  imports: [PrometheusModule],
  providers: [InfluxService],
  exports: [InfluxService, PrometheusModule],
})
export class InfluxdbModule {}
