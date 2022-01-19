import { PactFactory } from 'nestjs-pact';
import { Pact } from '@pact-foundation/pact';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { PactModule } from './pact.module';
import { CarsService } from '../../../src/cars/cars.service';
import { GET_CARS_LIST_INTERACTION } from './carsContractUtils';
import { Car } from '../../../src/cars/dao/car.dao';

describe('Pact', () => {
  let pactFactory: PactFactory;
  let provider: Pact;
  let carsService: CarsService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PactModule],
    }).compile();
    carsService = moduleRef.get(CarsService);
    pactFactory = moduleRef.get(PactFactory);

    provider = pactFactory.createContractBetween({
      consumer: 'nestjs-cloud-setup',
      provider: 'express-cloud-subservice',
    });
    await provider.setup();
    provider.addInteraction(GET_CARS_LIST_INTERACTION);
  });

  afterEach(() => provider.verify());

  afterAll(() => provider.finalize());

  it('should return list of cars', async () => {
    const result: Car = await carsService.getRandomCar();
    expect(result).not.toBeUndefined();
    expect(result).toHaveProperty('name');
  });
});
