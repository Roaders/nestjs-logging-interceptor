import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'nestjs-logging-interceptor';

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
