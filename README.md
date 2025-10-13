<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

# NestJS Backend Template

This repository provides a ready-to-use **NestJS backend template** designed to save you setup time by including the essential building blocks of any production-grade server.

---

## 🧩 Included Features

- **Global Exception Handler**
- **Unified Response Formatter**
- **Centralized Logging Service**
- **Authentication Guard (Reflector-based)**
- **Fastify Adapter** for higher performance
- **Swagger Documentation** for API visibility
- **Global Validation Pipes** for clean input handling

---

## ⚙️ Exception Handler

**File:** `src/common/filters/global.filter.ts`  
**Class:** `GlobalFilter`

Handles all thrown exceptions (both expected and unexpected) across the app.

### What it does:

- Catches all exceptions globally using `@Catch()`.
- Differentiates between expected (HTTP) and unexpected (system) errors.
- Logs errors to:
  - **Console** — for quick visibility during development.
  - **File** — for long-term debugging and auditing.
  - **Database** — optional via `ErrorsService` integration.
- Returns a consistent error response to the client.
- Automatically attaches a unique `errorId` for easier tracking.
- Prevents raw stack traces or sensitive data from leaking to clients.

### Example output:

```json
{
  "success": false,
  "message": "Internal Server Error occurred with id: (13c9f...), Please contact support.",
  "data": null,
  "error": "Internal Server Error occurred with id: (13c9f...), Please contact support.",
  "path": "/api/users",
  "statusCode": 500,
  "timestamp": "2025-10-13T09:00:00.000Z"
}
```

---

## ⚙️ Unified Response Formatter

**File:** `src/common/interceptors/response-formatter/response-formatter.interceptor.ts`  
**Class:** `ResponseFormatterInterceptor`

Ensures all successful API responses follow a single consistent structure.

### What it does:

- Intercepts every successful request before sending the response.
- Wraps all responses in a common structure for frontend consistency.
- Automatically includes:
  - `success` — boolean indicating operation result.
  - `message` — response message.
  - `data` — actual payload.
  - `path` — requested route.
  - `statusCode` — HTTP response status.
  - `timestamp` — UTC time of the response.
- Handles thrown errors gracefully when used with `GlobalFilter`.
- Reduces frontend parsing logic by guaranteeing predictable API shape.

### Example output:

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "Ahmed"
  },
  "path": "/api/users/1",
  "statusCode": 200,
  "timestamp": "2025-10-13T09:00:00.000Z"
}
```

---

## ⚙️ Centralized Logging Service

**File:** `src/features/logging/logging.service.ts`  
**Class:** `LoggingService`

Provides a unified way to log application activity, errors, and debug data.

### What it does:

- Acts as a wrapper around Nest's Logger class.
- Supports logging to:
  - **Console** for quick debugging.
  - **File system** for long-term traceability.
  - **Database** (optional) via an integrated model or service.
- Handles both system logs and business logs.
- Can be injected anywhere in the app to log:
  - Requests
  - Exceptions
  - Database queries
  - Business-level events
- Makes debugging and monitoring more consistent.

### Example usage:

```ts
this.logger.log('User created successfully');
this.logger.error('Database connection failed', error.stack);
this.logger.warn('High memory usage detected');
```

---

## ⚙️ Authentication Guard

**File:** `src/common/guards/auth.guard.ts`  
**Class:** `AuthGuard`

Protects routes by validating JWT tokens and handling public endpoints.

### What it does:

- Implements `CanActivate` to decide if a request can proceed.
- Uses `Reflector` to check for metadata set by `@Public()` decorator.
- Validates JWT tokens (or other credentials) from the `Authorization` header.
- Automatically attaches the decoded user to `request.user`.
- Can be applied globally or per-controller.

### Example setup (global guard):

```ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './common/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));
  await app.listen(3000);
}
bootstrap();
```

### Example usage with public routes:

```ts
import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  @Public()
  @Get('login')
  login() {
    return { message: 'This route is public' };
  }
}
```

---

## ⚙️ Fastify Adapter

**File:** `main.ts`

Replaces Express with Fastify for better performance and lower overhead.

### What it does:

- Uses `NestFastifyApplication` instead of the default Express adapter.
- Improves request throughput and memory efficiency.
- Works seamlessly with all NestJS features (pipes, filters, guards, etc.).

### Example setup:

```ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3000);
}
bootstrap();
```

---

## ⚙️ Swagger Documentation

**File:** `main.ts`

Provides automatic API documentation and testing via Swagger UI.

### What it does:

- Generates interactive API documentation at runtime.
- Groups endpoints by controller automatically.
- Simplifies backend testing without Postman.

### Example setup:

```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Backend API')
  .setDescription('API documentation for backend template')
  .setVersion('1.0')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

---

## ⚙️ Global Validation Pipes

**File:** `main.ts`

Enforces input validation automatically across the entire app.

### What it does:

- Ensures incoming data matches DTO structures.
- Strips out unknown properties.
- Returns clear validation error messages.

### Example setup:

```ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

---

## ✅ Summary

This template includes a solid foundation for any NestJS project:

- ✅ Unified and safe response handling.
- ✅ Strong error management.
- ✅ Configurable logging.
- ✅ Token-based authentication.
- ✅ Fast and secure Fastify setup.
- ✅ Developer-friendly Swagger documentation.
- ✅ Strict and clean input validation.

Use this as a starter for production-ready backend development.

---

## 📦 Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Configure your environment variables
4. Run the application: `npm run start:dev`
5. Access Swagger docs at: `http://localhost:3000/api/docs`

---

## 📝 About Me

my name is Ahmed Shehata, i'll be happy to hear from you if you have any suggestions any enhancements
https://ashehata.xyz
