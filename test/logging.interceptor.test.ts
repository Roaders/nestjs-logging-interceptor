import {
    BadRequestException,
    HttpStatus,
    INestApplication,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CatsModule } from './test-app/cats/cats.module';
import { CoreModule } from './test-app/core/core.module';

describe('Logging interceptor', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [CoreModule, CatsModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useLogger(Logger);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('logs the input and output request details - OK status code', async () => {
        const logSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'log');
        const url = `/cats/ok`;

        await request(app.getHttpServer()).get(url).expect(HttpStatus.OK);

        const incomingMsg = `REQUEST: GET ${url}`;
        const outgoingMsg = `RESPONSE: GET ${url} => ${HttpStatus.OK}`;

        /**
         * Info level
         */
        expect(logSpy).toBeCalledTimes(2);
        expect(logSpy.mock.calls[0]).toEqual([
            {
                message: incomingMsg,
            },
        ]);
        expect(logSpy.mock.calls[1]).toEqual([
            {
                message: outgoingMsg,
            },
        ]);
    });

    it('logs the input and output request details - BAD_REQUEST status code', async () => {
        const logSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'log');
        const warnSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'warn');
        const errorSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'error');
        const url = `/cats/badrequest`;

        await request(app.getHttpServer()).get(url).expect(HttpStatus.BAD_REQUEST);

        const incomingMsg = `REQUEST: GET ${url}`;
        const outgoingMsg = `ERROR: GET ${url} => 400`;

        /**
         * Info level
         */
        expect(logSpy).toBeCalledTimes(1);
        expect(logSpy.mock.calls[0]).toEqual([
            {
                message: incomingMsg,
            },
        ]);

        expect(warnSpy).toBeCalledTimes(1);
        expect(warnSpy.mock.calls[0]).toEqual([
            {
                message: outgoingMsg,
                error: expect.any(BadRequestException),
            },
        ]);

        expect(errorSpy).not.toHaveBeenCalled();
    });

    it('logs the input and output request details - INTERNAL_SERVER_ERROR status code', async () => {
        const logSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'log');
        const warnSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'warn');
        const errorSpy: jest.SpyInstance = jest.spyOn(Logger.prototype, 'error');
        const url = '/cats/internalerror';

        await request(app.getHttpServer()).get(url).expect(HttpStatus.INTERNAL_SERVER_ERROR);

        const incomingMsg = `REQUEST: GET ${url}`;
        const outgoingMsg = `ERROR: GET ${url} => ${HttpStatus.INTERNAL_SERVER_ERROR}`;

        /**
         * Info level
         */
        expect(logSpy).toBeCalledTimes(1);
        expect(logSpy.mock.calls[0]).toEqual([
            {
                message: incomingMsg,
            },
        ]);

        expect(errorSpy).toBeCalledTimes(1);
        expect(errorSpy.mock.calls[0]).toEqual([
            {
                message: outgoingMsg,
                error: expect.any(InternalServerErrorException),
            },
            expect.any(String),
        ]);

        expect(warnSpy).not.toHaveBeenCalled();
    });
});
