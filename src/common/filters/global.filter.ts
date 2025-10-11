import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { classValidatorFormatter } from './class-validator-formatter';
import { TError } from '../types/TError';
import { TResponse } from '../types/TResponse';
import { CONST_INTERNAL_SERVER_ERROR } from '@app/common/constraints/errors/errors.constraints';
import { ErrorsService } from 'src/features/errors/errors.service';
import fireAndForget from '../helpers/fireAndForget';
import { LoggingService } from 'src/features/logging/logging.service';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  constructor(
    private readonly errorsService: ErrorsService,
    private readonly loggingService: LoggingService,
  ) {}
  private readonly logger = new Logger(GlobalFilter.name);

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (status === 500) {
      const errorId = randomUUID();

      const errorRecord: TError = {
        uuid: errorId,
        message: (exception as Error).message,
        path: request.url,
        method: request.method,
        stack: (exception as Error).stack || 'NO-STACK',
        isHttp: exception instanceof HttpException,
        user: null, // TODO: Handle this depending on authentication
        time: new Date(),
        ip: request.ip,
      };

      // Log synchronously to console
      this.logger.error(`ErrorID: ${errorId}`, errorRecord.stack);
      // Log asynchronously to file (fire and forget)
      this.loggingService.logToFile({
        level: 'error',
        message: errorRecord.message,
        metaData: errorRecord,
      });

      // Optionally Store in DB asynchronously (fire and forget)
      // Comment this out if you don't want to store errors in DB
      fireAndForget(async () => {
        try {
          await this.errorsService.saveErrorToDatabase(errorRecord);
        } catch (error) {
          this.logger.error(`Error saving log to DB (id=${errorId}):`, error);
        }
      });

      const res: TResponse = {
        success: false,
        message: `${CONST_INTERNAL_SERVER_ERROR} occurred with id: ( ${errorId} ), Please contact support.`,
        data: null,
        error: `${CONST_INTERNAL_SERVER_ERROR} occurred with id: ( ${errorId} ), Please contact support.`,
        path: request.url,
        statusCode: status,
        timestamp: new Date(),
      };

      return response.status(status).send(res);
    }

    // Handle known exceptions
    this.logger.debug(`Client Error: ${exception}`);
    this.loggingService.logToFile({
      level: 'info',
      message: (exception as Error).message,
      metaData: {
        ip: request.ip,
        path: request.url,
        method: request.method,
        statusCode: status,
        user: null,
        requestId: request.id,
      },
    });

    const exp = exception as HttpException;
    const classValidationError = classValidatorFormatter(
      exception,
      request.url,
    );
    if (classValidationError) {
      return response.status(status).send(classValidationError);
    }

    const res: TResponse = {
      success: false,
      message: exp.message,
      data: null,
      error: exp.message,
      path: request.url,
      statusCode: status,
      timestamp: new Date(),
    };
    return response.status(status).send(res);
  }
}
