import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ErrorDocument } from './schemas/error.schema';
import { AbstractDocument } from 'src/config/database/abstract.repo';

@Injectable()
export class ErrorsRepo extends AbstractDocument<ErrorDocument> {
  constructor(
    @InjectModel(ErrorDocument.name)
    private readonly errorModel: Model<ErrorDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(connection, errorModel);
  }
}
