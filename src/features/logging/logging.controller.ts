import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { GetLogsDto } from './dtos/getLogs.dto';

@Controller('logging')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}
  @HttpCode(HttpStatus.OK)
  @Post('find')
  async getLogs(@Body() data: GetLogsDto) {
    return this.loggingService.getLogs(data);
  }
}
