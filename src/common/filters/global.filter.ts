import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { classValidatorFormatter } from './class-validator-formatter';
import { TError } from '../types/TError';
import { TResponse } from '../types/TResponse';
import { CONST_INTERNAL_SERVER_ERROR } from '@app/common/constraints/errors/errors.constraints';
import { ErrorsService } from 'src/features/errors/errors.service';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  constructor(private readonly errorsService: ErrorsService) {}
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (status === 500) {
      const errorRecord: TError = {
        message: (exception as Error).message,
        path: request.url,
        method: request.method,
        stack: (exception as Error).stack || 'NO-STACK',
        isHttp: exception instanceof HttpException ? true : false,

        //TODO: Manage User Based on Your Authentication Method
        user: 'Not Yet Managed',

        time: new Date(),
        ip: request.ip,
      };

      //! Log error to the console
      console.log(errorRecord);

      //! Store in DB
      await this.errorsService.saveErrorToDatabase(errorRecord);

      const res: TResponse = {
        data: null,
        error: CONST_INTERNAL_SERVER_ERROR,
        message: CONST_INTERNAL_SERVER_ERROR,
        path: request.url,
        statusCode: status,
        success: false,
        timestamp: new Date(),
      };
      return response.status(status).send(res);
    } else {
      // exception is not internal, just formatting response to the client
      const exp = exception as HttpException;

      // making sure its not class-validator error
      // if it is, classValidatorFormatter will return valid TResponse
      const classValidationError = classValidatorFormatter(
        exception,
        request.url,
      );
      if (classValidationError) {
        return response.status(status).send(classValidationError);
      }
      const res: TResponse = {
        data: null,
        error: exp.message,
        message: exp.message,
        path: request.url,
        statusCode: status,
        success: false,
        timestamp: new Date(),
      };
      return response.status(status).send(res);
    }
  }
}
