import { MultipartFile } from '@fastify/multipart';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UploadService } from './common/services/upload.service';

@Injectable()
export class AppService {
  constructor(private readonly uploadService: UploadService) {}
  getHello(): any {
    return 'Hello World';
  }

  test(req: FastifyRequest) {
    throw new InternalServerErrorException();
    return req.user;
  }

  async uploadFile(file: MultipartFile) {
    try {
      const uploaded = await this.uploadService.uploadFile(
        file,
        'Image',
        'test',
        null,
        'Image',
      );
      return uploaded;
    } catch (error) {
      console.log(error);
    }
  }
}
