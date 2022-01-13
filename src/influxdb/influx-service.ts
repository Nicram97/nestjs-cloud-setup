import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import {
  Inject,
  Injectable,
  LoggerService,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { metric } from 'prom-client';
import { PrometheusService } from '../prometheus/prometheus.service';

@Injectable()
export class InfluxService implements OnApplicationBootstrap {
  private influxDb: InfluxDB;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService,
    private prometheusService: PrometheusService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onApplicationBootstrap() {
    if (this.configService.get<string>('influxClient.INFLUX_URL')) {
      this.influxDb = new InfluxDB({
        url: this.configService.get<string>('influxClient.INFLUX_URL'),
        token: this.configService.get<string>(
          'influxClient.INFLUX_ACCESS_TOKEN',
        ),
      });
      const interval = setInterval(
        this.sendPrometheusMetricsToInflux,
        this.configService.get<number>('influxClient.INFLUX_SEND_INTERVAL_MS'),
      );
      this.schedulerRegistry.addInterval(
        'sendPrometheusMetricsToInflux',
        interval,
      );
    }
  }

  private async sendPrometheusMetricsToInflux(): Promise<void> {
    const influxPoints: Point[] = this.parsePrometheusJsonToInflux(
      await this.prometheusService.getMetricsAsJson(),
    );
    const writeAPI: WriteApi = this.influxDb.getWriteApi(
      this.configService.get<string>('influxClient.INFLUX_ORGANIZATION'),
      this.configService.get<string>('influxClient.INFLUX_BUCKET_ID'),
    );
    writeAPI.writePoints(influxPoints);
    await writeAPI.close();
  }

  private parsePrometheusJsonToInflux(prometheusData: metric[]): Point[] {
    const influxPoints: Point[] = [];
    prometheusData.forEach((metric) => {
      const point: Point = new Point(metric.name)
        .tag('aggregator', metric.aggregator)
        .tag('description', metric.help)
        .tag('type', metric.type.toString());

      if ((metric as any).values.length > 0) {
        ((metric as any).values as Array<any>).forEach((element) => {
          const label =
            (element.labels[
              Object.keys(element.labels).find((key) => key === 'space')
            ] as string) || metric.name;
          const value = element.value;
          if (isNaN(value)) {
            point.stringField(label, value.toString());
          }
          if (label === 'nodejs_version_info') {
            point.stringField(label, element.labels.version.toString());
          } else {
            point.floatField(label, value);
          }
        });
      } else {
        point.floatField('value', 0);
      }
      influxPoints.push(point);
    });
    return influxPoints;
  }
}
