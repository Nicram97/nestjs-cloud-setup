import { Module } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';
import { PrometheusController } from './prometheus.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [PrometheusService],
  controllers: [PrometheusController],
  exports: [PrometheusService, DbModule],
})
export class PrometheusModule {}
