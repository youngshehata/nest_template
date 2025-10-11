import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { GetLogsDto } from './dtos/getLogs.dto';

@Controller('logging')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}
  @Post('find')
  async getLogs(@Body() data: GetLogsDto) {
    return this.loggingService.getLogs(data);
  }
}
