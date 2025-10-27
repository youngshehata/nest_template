import { Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './common/decorators/roles.decorator';
import { FastifyRequest } from 'fastify';
import { FastifyFileInterceptor } from './common/interceptors/file-upload/fastify-file.interceptor';

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

  @Post('upload')
  @Roles('admin')
  @UseInterceptors(new FastifyFileInterceptor())
  async postTest(@Req() req: FastifyRequest) {
    const file = (req as any).uploadedFile;
    if (!file) {
      return { message: 'No file received' };
    }

    const result = await this.appService.uploadFile(file);
    return { success: true, fileName: result };
  }
}
