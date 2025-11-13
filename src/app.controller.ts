import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './common/decorators/roles.decorator';
import { FastifyRequest } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @Roles('admin')
  getTest(@Req() req: FastifyRequest) {
    return this.appService.test(req);
  }
}
