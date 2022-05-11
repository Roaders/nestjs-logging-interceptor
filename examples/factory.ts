import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'nestjs-logging-interceptor';

// ts-command-line-args_write-markdown_copyCodeBelow
@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useValue: new LoggingInterceptor('CUSTOM CONTEXT'),
        },
    ],
})
export class AppModule {}
