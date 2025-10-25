import { Module } from '@nestjs/common';
import { ErrorsService } from './errors.service';
import { ErrorsController } from './errors.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ErrorsRepo } from './errors.repo';

@Module({
  controllers: [ErrorsController],
  providers: [ErrorsService, ErrorsRepo, PrismaService],
  exports: [ErrorsService],
})
export class ErrorsModule {}
