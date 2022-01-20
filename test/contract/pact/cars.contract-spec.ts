import { Pact } from '@pact-foundation/pact';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import {
  CARS_PACT_OPTIONS,
  GET_CARS_LIST_INTERACTION,
} from './carsContractUtils';
import * as request from 'supertest';
import { Car } from '../../../src/cars/dao/car.dao';
import { initPactProvider } from '../pactUtils';
import { INestApplication } from '@nestjs/common';

const provider: Pact = initPactProvider(CARS_PACT_OPTIONS);

describe('Pact', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    await provider.setup();
    provider.addInteraction(GET_CARS_LIST_INTERACTION);
  });

  afterEach(async () => {
    await provider.verify();
  });

  afterAll(async () => {
    await app.close();
    await provider.finalize();
  });

  it('should return list of cars', async () => {
    const response = await request(app.getHttpServer())
      .get('/cars')
      .expect(200);

    const randomCar: Car = response.body;
    expect(randomCar).toBeDefined();
    expect(typeof randomCar.name).toBe('string');
  });
});
