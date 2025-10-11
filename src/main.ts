import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { GlobalFilter } from './common/filters/global.filter';
import { ErrorsService } from './features/errors/errors.service';
import { ResponseFormatterInterceptor } from './common/interceptors/response-formatter/response-formatter.interceptor';
import { LoggingService } from './features/logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useLogger(
    process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  );

  app.useGlobalFilters(
    new GlobalFilter(app.get(ErrorsService), app.get(LoggingService)),
  );
  app.useGlobalInterceptors(
    new ResponseFormatterInterceptor(app.get(LoggingService)),
  );

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', () => {
    console.log(`Server running on port ${process.env.PORT ?? 3000}`);
  });
}
bootstrap();
