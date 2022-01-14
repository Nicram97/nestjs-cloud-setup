import { Controller, Get, Inject, LoggerService } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @ApiOperation({ summary: 'Get Hello World string example' })
  @ApiOkResponse({
    status: 200,
    description: 'Return string with value Hello World',
  })
  @Get()
  getHello(): string {
    this.logger.log('test');
    return 'Hello world';
  }
}
