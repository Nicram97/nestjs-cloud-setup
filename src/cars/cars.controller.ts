import { Controller, Get } from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car } from './dao/car.dao';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Get('/')
  async getRandomCar(): Promise<Car> {
    return this.carsService.getRandomCar();
  }
}
