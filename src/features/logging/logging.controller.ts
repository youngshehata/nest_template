import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { GetLogsDto } from './dtos/getLogs.dto';
import { FastifyReply } from 'fastify';

@Controller('logging')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}
  @Post('find')
  async getLogs(@Body() data: GetLogsDto, @Res() res: FastifyReply) {
    const response = await this.loggingService.getLogs(data);
    return res.status(200).send(response);
  }
}
