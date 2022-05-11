import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'nestjs-logging-interceptor';

// ts-command-line-args_write-markdown_copyCodeBelow
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
