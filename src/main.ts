import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { GlobalFilter } from './common/filters/global.filter';
import { ErrorsService } from './features/errors/errors.service';
import { ResponseFormatterInterceptor } from './common/interceptors/response-formatter/response-formatter.interceptor';
import { LoggingService } from './features/logging/logging.service';
import helmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './config/swagger/swagger.options';
import { fastifyCookie } from '@fastify/cookie';
import { RolesGuard } from './common/guards/roles.guard';
import { RolesService } from './features/roles/roles.service';
import { UsersService } from './features/users/users.service';
import fastifyMultipart from '@fastify/multipart';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  //! ############ Helmet ############
  await app.register(helmet);

  //! ############ Fastify ############
  app.register(fastifyCookie as any);
  app.register(fastifyMultipart as any, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB limit
    },
  });

  //! ############ Logger ############
  app.useLogger(
    process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  );

  //! ############ Swagger ############
  const documentFactory = () => {
    return SwaggerModule.createDocument(app, swaggerOptions);
  };
  SwaggerModule.setup('swagger', app, documentFactory);

  //! ############ Globals ############
  app.useGlobalFilters(
    new GlobalFilter(app.get(ErrorsService), app.get(LoggingService)),
  );
  app.useGlobalInterceptors(
    new ResponseFormatterInterceptor(app.get(LoggingService)),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  //TODO: Uncomment and import Reflector,RolesGuard if you want to use guards
  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new RolesGuard(reflector, app.get(UsersService), app.get(RolesService)),
  );

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', () => {
    console.log(`Server running on port ${process.env.PORT ?? 3000}`);
  });
}

bootstrap();
