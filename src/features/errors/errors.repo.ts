import { AbstractRepo } from '@app/common/abstracts/abstract.repo';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ErrorsRepo extends AbstractRepo<PrismaService['errors']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.errors);
  }
}
