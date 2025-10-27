import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

export class FastifyFileInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: FastifyRequest = context.switchToHttp().getRequest();

    if (typeof (req as any).file !== 'function') {
      throw new BadRequestException(
        'Fastify multipart plugin not registered on server',
      );
    }

    let file: any;
    try {
      file = await (req as any).file();
    } catch (err: any) {
      if (err.message.includes('not multipart')) {
        throw new BadRequestException(
          'Request content type must be multipart/form-data',
        );
      }
      throw new BadRequestException('Invalid file upload request');
    }

    if (!file) {
      throw new NotFoundException('File not found in request');
    }

    (req as any).uploadedFile = file;
    return next.handle();
  }
}
