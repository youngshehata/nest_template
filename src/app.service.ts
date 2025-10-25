import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AppService {
  getHello(): any {
    return 'Hello World';
  }

  test(req: FastifyRequest) {
    return req.user;
  }
}
