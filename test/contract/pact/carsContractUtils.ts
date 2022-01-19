import {
  Interaction,
  InteractionObject,
  VerifierOptions,
} from '@pact-foundation/pact';
import { eachLike, like } from '@pact-foundation/pact/src/dsl/matchers';
import { PactConsumerOverallOptions } from 'nestjs-pact';
import path = require('path');

export const CARS_PROVIDER_OPTIONS: PactConsumerOverallOptions = {
  consumer: {
    host: 'localhost',
    log: path.resolve(process.cwd(), 'test', 'contract', 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'test', 'contract', 'pact'),
    port: 3001,
    logLevel: 'debug',
  },
};

export const GET_CARS_LIST_EXPECTED_BODY = eachLike({
  Name: like('chevrolet chevelle malibu'),
  Year: like('1970-01-01'),
  Origin: like('USA'),
});

export const GET_CARS_LIST_INTERACTION: InteractionObject | Interaction = {
  state: 'provider contain list of cars',
  uponReceiving: 'a request for list of cars',
  withRequest: {
    path: '/',
    method: 'GET',
  },
  willRespondWith: {
    body: GET_CARS_LIST_EXPECTED_BODY,
    status: 200,
  },
};

export const VERIFIER_OPTIONS: VerifierOptions = {
  provider: 'nestjs-cloud-subservice',
  providerBaseUrl: 'http://localhost:3001',
  pactUrls: [
    path.resolve(
      process.cwd(),
      'test',
      'contract',
      'pact',
      'nestjs-cloud-setup-express-cloud-subservice.json',
    ),
  ],
};
