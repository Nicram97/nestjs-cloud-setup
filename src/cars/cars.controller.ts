import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { Car } from './dao/car.dao';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @ApiOperation({ summary: 'getRandomCar' })
  @ApiOkResponse({
    status: 200,
    description:
      'Make request to Subservice, extract list of cars and then pick one random then return it.',
  })
  @Get('/')
  async getRandomCar(): Promise<Car> {
    return this.carsService.getRandomCar();
  }
}
