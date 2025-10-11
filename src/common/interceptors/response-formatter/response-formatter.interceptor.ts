import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable, catchError, map, throwError } from 'rxjs';
import { TResponse } from '@app/common/types/TResponse';
import { LoggingService } from 'src/features/logging/logging.service';

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}
  private logger = new Logger(ResponseFormatterInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<FastifyReply>();
    const req = res.request as any;
    // handle the response payload
    return next.handle().pipe(
      map((data) => {
        const formatted: TResponse = {
          success: true,
          message: data?.message ?? 'OK',
          data: data?.data ?? data,
          error: null,
          path: req.url,
          statusCode: res.statusCode ?? 200,
          timestamp: new Date(),
        };

        // logging to console
        this.logger.log(
          `Response ${res.statusCode} - ${req.method} ${req.url}`,
        );
        // logging to file
        this.loggingService.logToFile({
          level: 'info',
          message: formatted.message,
          metaData: {
            ip: req.ip,
            path: req.url,
            method: req.method,
            statusCode: formatted.statusCode,
            user: null,
            requestId: req.id,
          },
        });
        return formatted;
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
