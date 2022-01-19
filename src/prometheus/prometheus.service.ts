import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/typeorm';
import {
  collectDefaultMetrics,
  Gauge,
  Histogram,
  Metric,
  metric,
  Registry,
  Summary,
  SummaryConfiguration,
} from 'prom-client';
import { Connection } from 'typeorm';

@Injectable()
export class PrometheusService implements OnModuleInit {
  private postgresDbConnections: Summary<string>;
  private readonly registry: Registry;

  constructor(
    private configService: ConfigService,
    @InjectConnection()
    private connection: Connection,
  ) {
    this.registry = new Registry();
    collectDefaultMetrics({
      register: this.registry,
    });
  }
  async onModuleInit(): Promise<void> {
    if (this.configService.get<string>('database.DB_HOST')) {
      this.postgresDbConnections = await this.registerSummary({
        name: 'opened_connections',
        help: 'Number of opened connections in database',
        labelNames: ['opened'],
        aggregator: 'omit',
      });
      this.postgresDbConnections
        .labels('opened')
        .observe(this.getPostgresDbPoolSize());
    }
  }

  public getMetrics(): Promise<string> {
    if (this.configService.get<string>('database.DB_HOST')) {
      this.postgresDbConnections
        .labels('opened')
        .observe(this.getPostgresDbPoolSize());
    }
    return this.registry.metrics();
  }

  public getMetricsAsJson(): Promise<metric[]> {
    if (this.configService.get<string>('database.DB_HOST')) {
      this.postgresDbConnections
        .labels('opened')
        .observe(this.getPostgresDbPoolSize());
    }
    return this.registry.getMetricsAsJSON();
  }

  public registerHistogram(
    name: string,
    help: string,
    labelNames: string[],
    buckets: number[],
  ): Histogram<string> {
    const metric: Metric<string> = this.registry.getSingleMetric(name);
    if (metric === undefined) {
      const histogram = new Histogram({ name, help, labelNames, buckets });
      this.registry.registerMetric(histogram);
      return histogram;
    }
    return metric as Histogram<string>;
  }

  public registerGauge(name: string, help: string): Gauge<string> {
    const metric: Metric<string> = this.registry.getSingleMetric(name);
    if (metric === undefined) {
      const gauge = new Gauge({
        name: name,
        help,
      });
      this.registry.registerMetric(gauge);
      return gauge;
    }
    return metric as Gauge<string>;
  }

  public async registerSummary(
    summaryConfiguration: SummaryConfiguration<string>,
  ): Promise<Summary<string>> {
    const metric: Metric<string> = this.registry.getSingleMetric(
      summaryConfiguration.name,
    );
    if (metric === undefined) {
      const summary = new Summary(summaryConfiguration);
      this.registry.registerMetric(summary);
      return summary;
    }
    return metric as Summary<string>;
  }

  public removeSingleMetric(name: string): void {
    return this.registry.removeSingleMetric(name);
  }

  public clearMetrics(): void {
    this.registry.resetMetrics();
    return this.registry.clear();
  }

  getPostgresDbPoolSize(): number {
    return (this.connection.driver as any).postgres.Pool.length;
  }
}
