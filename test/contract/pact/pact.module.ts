import { Module } from '@nestjs/common';
import { PactConsumerModule } from 'nestjs-pact';
import { CARS_PROVIDER_OPTIONS } from './carsContractUtils';

@Module({
  imports: [PactConsumerModule.register(CARS_PROVIDER_OPTIONS)],
})
export class PactModule {}
