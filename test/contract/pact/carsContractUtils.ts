import {
  Interaction,
  InteractionObject,
  PactOptions,
  VerifierOptions,
} from '@pact-foundation/pact';
import { eachLike, like } from '@pact-foundation/pact/src/dsl/matchers';
import path = require('path');

export const CARS_PACT_OPTIONS: PactOptions = {
  consumer: 'nestjs-cloud-setup',
  provider: 'express-cloud-subservice',
  host: 'localhost',
  log: path.resolve(process.cwd(), 'test', 'contract', 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'test', 'contract', 'pact'),
  port: 3001,
  logLevel: 'debug',
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
  provider: 'express-cloud-subservice',
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
