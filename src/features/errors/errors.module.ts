import { Module } from '@nestjs/common';
import { ErrorsService } from './errors.service';
import { ErrorsController } from './errors.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ErrorsController],
  providers: [ErrorsService, PrismaService],
  exports: [ErrorsService],
})
export class ErrorsModule {}
