<p align="center">
  <a href="http://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

<p align="center">
  A <a href="https://github.com/nestjs/nest">Nest</a> interceptor to log the incoming/outgoing requests.
</p>

# NestJS Logging interceptor

(copied from [nestjs-components](https://github.com/algoan/nestjs-components))

A simple NestJS interceptor catching request details and logging it using the built-in [Logger](https://docs.nestjs.com/techniques/logger#logger) class. It will use the default Logger implementation unless you pass your own to your Nest application.

## Installation

```bash
npm install --save nestjs-logging-interceptor
```

## Usage
### Default usage
Use the interceptor as a global interceptor (cf. refer to the [last paragraph](https://docs.nestjs.com/interceptors#binding-interceptors) of this section for more details).

Example:

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'nestjs-logging-interceptor';

/**
 * Core module: This module sets the logging interceptor as a global interceptor
 */
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class CoreModule {}
```

In the example above, the interceptor is provided by the CoreModule. It could be set on any module that your main module is using.

### Factory
You can also manually pass an interceptor instance through a factory function. This will give the possibility to set a `userPrefix` on the head of the default context message:

Example:

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'nestjs-logging-interceptor';

/**
 * Core module: This module sets the logging interceptor as a global interceptor
 */
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: () => {
        const interceptor: LoggingInterceptor = new LoggingInterceptor();
        interceptor.setUserPrefix('ExampleApp');

        return interceptor;
      },
    },
  ],
})
export class CoreModule {}
```
