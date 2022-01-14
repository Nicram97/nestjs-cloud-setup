import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { firstValueFrom } from 'rxjs';
import { Car } from './dao/car.dao';

@Injectable()
export class CarsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  async getRandomCar(): Promise<Car> {
    try {
      const subserviceUrl: string =
        this.configService.get<string>('subservice.URL');
      const subservicePort: number =
        this.configService.get<number>('subservice.PORT');
      const carsJsonRequest = this.httpService.get(
        `${subserviceUrl}:${subservicePort}`,
      );
      const carsJson = (await firstValueFrom(carsJsonRequest)).data;
      const randomCar: Car = new Car(
        carsJson[this.getRandomInt(carsJson.length)],
      );
      return randomCar;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
