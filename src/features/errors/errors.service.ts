import { TError } from '@app/common/types/TError';
import { Injectable } from '@nestjs/common';
import { ErrorsRepo } from './errors.repo';

@Injectable()
export class ErrorsService {
  constructor(private readonly repo: ErrorsRepo) {}
  async saveErrorToDatabase(error: TError) {
    await this.repo.create({ data: error });
  }
}
