import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/typeorm';
import {
  collectDefaultMetrics,
  Gauge,
  Histogram,
  metric,
  Registry,
  Summary,
  SummaryConfiguration,
} from 'prom-client';
import { Connection } from 'typeorm';

export type PrometheusHistogram = Histogram<string>;

interface MapHistogram {
  [key: string]: Histogram<string>;
}

interface MapGauge {
  [key: string]: Gauge<string>;
}

interface MapSummary {
  [key: string]: Summary<string>;
}

@Injectable()
export class PrometheusService {
  private postgresDbConnections: Summary<string>;
  private registeredMetrics: MapHistogram = {};
  private registeredGauges: MapGauge = {};
  private registeredSummaries: MapSummary = {};
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
    if (this.configService.get<string>('database.DB_HOST')) {
      this.postgresDbConnections = this.registerSummary({
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
    if (this.registeredMetrics[name] === undefined) {
      const histogram = new Histogram({ name, help, labelNames, buckets });
      this.registry.registerMetric(histogram);
      this.registeredMetrics[name] = histogram;
    }
    return this.registeredMetrics[name];
  }

  public registerGauge(name: string, help: string): Gauge<string> {
    if (this.registeredGauges[name] === undefined) {
      const gauge = (this.registeredGauges[name] = new Gauge({
        name: name,
        help,
      }));
      this.registry.registerMetric(gauge);
      this.registeredGauges[name] = gauge;
    }
    return this.registeredGauges[name];
  }

  public registerSummary(
    summaryConfiguration: SummaryConfiguration<string>,
  ): Summary<string> {
    if (this.registerSummary[summaryConfiguration.name] === undefined) {
      const summary = (this.registerSummary[summaryConfiguration.name] =
        new Summary(summaryConfiguration));
      this.registry.registerMetric(summary);
      this.registeredSummaries[summaryConfiguration.name] = summary;
    }
    return this.registeredSummaries[summaryConfiguration.name];
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
