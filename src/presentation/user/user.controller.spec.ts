import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { UserController } from './user.controller';
import { GetUserCurrencyUseCase } from '../../usecases/get-user-currency/get-user-currency.usecase';

describe('UserController', () => {
  let app: INestApplication;
  const execute = jest.fn();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: GetUserCurrencyUseCase,
          useValue: { execute },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /user/currency should call use case with bearer token and return payload', async () => {
    execute.mockResolvedValue({ userId: 'user-1', chip: 12, cash: 8 });
    const httpServer = app.getHttpServer() as App;

    const response = await request(httpServer)
      .get('/user/currency')
      .set('authorization', 'Bearer token-abc')
      .expect(200);

    expect(execute).toHaveBeenCalledWith('token-abc');
    expect(response.body).toEqual({ userId: 'user-1', chip: 12, cash: 8 });
  });

  it('GET /user/currency should call use case with undefined token when header is missing', async () => {
    execute.mockResolvedValue({ userId: 'user-1', chip: 0, cash: 0 });
    const httpServer = app.getHttpServer() as App;

    await request(httpServer).get('/user/currency').expect(200);

    expect(execute).toHaveBeenCalledWith(undefined);
  });
});
