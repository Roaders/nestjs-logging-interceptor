<p align="center">
  <a href="http://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

<p align="center">
  A <a href="https://github.com/nestjs/nest">Nest</a> interceptor to log the incoming/outgoing requests.
</p>

# NestJS Logging interceptor

(copied from [nestjs-components](https://github.com/algoan/nestjs-components))

A simple NestJS interceptor intercepting request details and logging it using the built-in [Logger](https://docs.nestjs.com/techniques/logger#logger) class. It will use the default Logger implementation unless you pass your own to your Nest application.

## Installation

```bash
npm install --save nestjs-logging-interceptor
```

## Usage
### Default usage
Use the interceptor as a global interceptor (refer to the [last paragraph](https://docs.nestjs.com/interceptors#binding-interceptors) of this section for more details).

Example:

[//]: # (ts-command-line-args_write-markdown_insertCodeBelow file="examples/default.ts" codeComment="ts")
```ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'nestjs-logging-interceptor';

@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}

```
[//]: # (ts-command-line-args_write-markdown_insertCodeAbove)

### Factory
You can also manually pass an interceptor instance through a factory function. This will allow you to set a custom scope for your interceptor to use when logging.

Example:

[//]: # (ts-command-line-args_write-markdown_insertCodeBelow file="examples/factory.ts" codeComment="ts")
```ts
@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useValue: new LoggingInterceptor('CUSTOM CONTEXT'),
        },
    ],
})
export class AppModule {}

```
[//]: # (ts-command-line-args_write-markdown_insertCodeAbove)

### Custom Handlers
When constructing the logging interceptor yourself using a factory it is possible to override the handlers with your own logging handlers:

Example:

[//]: # (ts-command-line-args_write-markdown_insertCodeBelow file="examples/custom-handlers.ts" codeComment="ts")
```ts
@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useValue: new LoggingInterceptor({
                requestHandler: (request, logger) => logger.log(`URL Requested: ${request.url}`),
                responseHandler: (request, response, _body, logger) =>
                    logger.log(`URL Response: ${request.url} status code: ${response.status}`),
                errorHandler: (request, error, logger) => logger.error(`Request Error: ${request.url}`, error),
            }),
        },
    ],
})
export class AppModule {}

```
[//]: # (ts-command-line-args_write-markdown_insertCodeAbove)

### Multiple Interceptors
Lastly it is possible to configure a different logger with a different context for each handler:

[//]: # (ts-command-line-args_write-markdown_insertCodeBelow file="examples/multiple-loggers.ts" codeComment="ts")
```ts
@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useValue: new LoggingInterceptor({
                context: 'REQUEST LOGGER',
                requestHandler: (request, logger) => logger.log(`URL Requested: ${request.url}`),
                responseHandler: null,
                errorHandler: null,
            }),
        },
        {
            provide: APP_INTERCEPTOR,
            useValue: new LoggingInterceptor({
                context: 'RESPONSE LOGGER',
                requestHandler: null,
                responseHandler: (request, response, _body, logger) =>
                    logger.log(`URL Response: ${request.url} status code: ${response.status}`),
                errorHandler: null,
            }),
        },
        {
            provide: APP_INTERCEPTOR,
            useValue: new LoggingInterceptor({
                context: 'ERROR LOGGER',
                requestHandler: null,
                responseHandler: null,
                errorHandler: (request, error, logger) => logger.error(`Request Error: ${request.url}`, error),
            }),
        },
    ],
})
export class AppModule {}

```
[//]: # (ts-command-line-args_write-markdown_insertCodeAbove)