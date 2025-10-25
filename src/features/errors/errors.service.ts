import { TError } from '@app/common/types/TError';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ErrorsService {
  constructor(private readonly prismaService: PrismaService) {}
  async saveErrorToDatabase(error: TError) {
    //TODO: Handle Saving Error To Database Logic Here
    await this.prismaService.errors.create({ data: error });
  }
}
