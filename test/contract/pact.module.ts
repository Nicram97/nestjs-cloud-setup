import { Module } from '@nestjs/common';
import { PactModule } from './pact/pact.module';

@Module({
  imports: [PactConsume, PactModule],
})
export class PactModule {}
