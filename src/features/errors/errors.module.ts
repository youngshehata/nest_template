import { Module } from '@nestjs/common';
import { ErrorsService } from './errors.service';
import { ErrorsController } from './errors.controller';
import { ErrorsRepo } from './errors.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorDocument, ErrorSchema } from './schemas/error.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ErrorDocument.name, schema: ErrorSchema },
    ]),
  ],
  controllers: [ErrorsController],
  providers: [ErrorsService, ErrorsRepo],
  exports: [ErrorsService],
})
export class ErrorsModule {}
