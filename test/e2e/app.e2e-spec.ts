import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Car } from '../../src/cars/dao/car.dao';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello world');
  });

  it('/cars (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/cars')
      .expect(200);

    const randomCar: Car = response.body;
    expect(randomCar.acceleration).toBeDefined();
    expect(typeof randomCar.acceleration).toBe('number');
  });
});
