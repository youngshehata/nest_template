import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    throw new NotFoundException();
    return 'Hello World';
  }
}
