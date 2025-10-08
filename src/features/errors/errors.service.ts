import { TError } from '@app/common/types/TError';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorsService {
  async saveErrorToDatabase(error: TError) {
    //TODO: Handle Saving Error To Database Logic Here
  }
}
