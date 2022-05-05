import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NestInterceptor,
    Optional,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export type RequestHandler = (request: Request, logger: Logger) => void;
export type ResponseHandler = (request: Request, response: Response, body: unknown, logger: Logger) => void;
export type ErrorHandler = (request: Request, error: Error, logger: Logger) => void;

export const defaultRequestHandler: RequestHandler = (request: Request, logger: Logger) => {
    const message = `REQUEST: ${request.method} ${request.url}`;
    logger.log({ message });
};

export const defaultResponseHandler: ResponseHandler = (
    request: Request,
    response: Response,
    _body: unknown,
    logger: Logger
) => {
    const message = `RESPONSE: ${request.method} ${request.url} => ${response.statusCode}`;
    logger.log({ message });
};

export const defaultErrorHandler: ErrorHandler = (request: Request, error: Error, logger: Logger) => {
    if (error instanceof HttpException) {
        const statusCode: number = error.getStatus();
        const message = `ERROR: ${request.method} ${request.url} => ${statusCode}`;

        if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            logger.error(
                {
                    message,
                    error,
                },
                error.stack
            );
        } else {
            logger.warn({
                message,
                error,
            });
        }
    } else {
        logger.error(
            {
                message: `ERROR: ${request.method} ${request.url}`,
            },
            error.stack
        );
    }
};

/**
 * Interceptor that logs input/output requests
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger: Logger;

    constructor(
        @Optional() private requestHandler: RequestHandler | null = defaultRequestHandler,
        @Optional() private responseHandler: ResponseHandler | null = defaultResponseHandler,
        @Optional() private errorHandler: ErrorHandler | null = defaultErrorHandler,
        @Optional() context = LoggingInterceptor.name
    ) {
        this.logger = new Logger(context);
    }

    /**
     * Intercept method, logs before and after the request being processed
     * @param context details about the current request
     * @param callHandler implements the handle method that returns an Observable
     */
    public intercept(context: ExecutionContext, callHandler: CallHandler): Observable<unknown> {
        if (this.requestHandler != null) {
            const request = context.switchToHttp().getRequest();
            this.requestHandler(request, this.logger);
        }

        return callHandler.handle().pipe(
            tap({
                next: (val: unknown): void => {
                    this.logNext(val, context);
                },
                error: (err: Error): void => {
                    this.logError(err, context);
                },
            })
        );
    }

    /**
     * Logs the request response in success cases
     * @param body body returned
     * @param context details about the current request
     */
    private logNext(body: unknown, context: ExecutionContext): void {
        if (this.responseHandler != null) {
            const request = context.switchToHttp().getRequest<Request>();
            const response = context.switchToHttp().getResponse<Response>();

            this.responseHandler(request, response, body, this.logger);
        }
    }

    /**
     * Logs the request response in success cases
     * @param error Error object
     * @param context details about the current request
     */
    private logError(error: Error, context: ExecutionContext): void {
        const request = context.switchToHttp().getRequest<Request>();

        if (this.errorHandler != null) {
            this.errorHandler(request, error, this.logger);
        }
    }
}
