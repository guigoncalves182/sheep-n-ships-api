import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { UserController } from './user.controller';
import { GetUserCurrencyUseCase } from '../../usecases/get-user-currency/get-user-currency.usecase';
import { GetUserOrdersUseCase } from '../../usecases/get-user-orders/get-user-orders.usecase';
import { CreateSheepOrder } from '../../usecases/create-sheep-order/create-sheep-order';
import { EOrderType } from '../../data/schemas/order.schema';

describe('UserController', () => {
  let app: INestApplication;
  const executeCurrency = jest.fn();
  const executeOrders = jest.fn();
  const executeCreateSheepOrder = jest.fn();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: GetUserCurrencyUseCase,
          useValue: { execute: executeCurrency },
        },
        {
          provide: GetUserOrdersUseCase,
          useValue: { execute: executeOrders },
        },
        {
          provide: CreateSheepOrder,
          useValue: { execute: executeCreateSheepOrder },
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
    executeCurrency.mockResolvedValue({ userId: 'user-1', chip: 12, cash: 8 });
    const httpServer = app.getHttpServer() as App;

    const response = await request(httpServer)
      .get('/user/currency')
      .set('authorization', 'Bearer token-abc')
      .expect(200);

    expect(executeCurrency).toHaveBeenCalledWith('token-abc');
    expect(response.body).toEqual({ userId: 'user-1', chip: 12, cash: 8 });
  });

  it('GET /user/currency should call use case with undefined token when header is missing', async () => {
    executeCurrency.mockResolvedValue({ userId: 'user-1', chip: 0, cash: 0 });
    const httpServer = app.getHttpServer() as App;

    await request(httpServer).get('/user/currency').expect(200);

    expect(executeCurrency).toHaveBeenCalledWith(undefined);
  });

  it('GET /user/orders should call use case with bearer token and return payload', async () => {
    executeOrders.mockResolvedValue([
      {
        userId: 'user-1',
        type: EOrderType.Sheep,
        createdAt: '2026-01-01T00:00:00.000Z',
        fulfilledAt: '2026-01-01T01:00:00.000Z',
      },
    ]);
    const httpServer = app.getHttpServer() as App;

    const response = await request(httpServer)
      .get('/user/orders')
      .set('authorization', 'Bearer token-orders')
      .expect(200);

    expect(executeOrders).toHaveBeenCalledWith('token-orders');
    expect(response.body).toEqual([
      {
        userId: 'user-1',
        type: EOrderType.Sheep,
        createdAt: '2026-01-01T00:00:00.000Z',
        fulfilledAt: '2026-01-01T01:00:00.000Z',
      },
    ]);
  });

  it('GET /user/orders should call use case with undefined token when header is missing', async () => {
    executeOrders.mockResolvedValue([]);
    const httpServer = app.getHttpServer() as App;

    await request(httpServer).get('/user/orders').expect(200);

    expect(executeOrders).toHaveBeenCalledWith(undefined);
  });

  it('POST /user/orders/sheep should call use case with bearer token and return payload', async () => {
    executeCreateSheepOrder.mockResolvedValue({
      userId: 'user-1',
      type: EOrderType.Sheep,
      createdAt: '2026-01-01T00:00:00.000Z',
      fulfilledAt: '2026-01-01T01:00:00.000Z',
    });
    const httpServer = app.getHttpServer() as App;

    const response = await request(httpServer)
      .post('/user/orders/sheep')
      .set('authorization', 'Bearer token-create')
      .expect(201);

    expect(executeCreateSheepOrder).toHaveBeenCalledWith('token-create');
    expect(response.body).toEqual({
      userId: 'user-1',
      type: EOrderType.Sheep,
      createdAt: '2026-01-01T00:00:00.000Z',
      fulfilledAt: '2026-01-01T01:00:00.000Z',
    });
  });

  it('POST /user/orders/sheep should call use case with undefined token when header is missing', async () => {
    executeCreateSheepOrder.mockResolvedValue({
      userId: 'user-1',
      type: EOrderType.Sheep,
      createdAt: '2026-01-01T00:00:00.000Z',
      fulfilledAt: '2026-01-01T01:00:00.000Z',
    });
    const httpServer = app.getHttpServer() as App;

    await request(httpServer).post('/user/orders/sheep').expect(201);

    expect(executeCreateSheepOrder).toHaveBeenCalledWith(undefined);
  });

  it('POST /user/orders/sheep should return 400 when chips are insufficient', async () => {
    executeCreateSheepOrder.mockRejectedValue(
      new BadRequestException('Insufficient chips'),
    );
    const httpServer = app.getHttpServer() as App;

    const response = await request(httpServer)
      .post('/user/orders/sheep')
      .set('authorization', 'Bearer token-create')
      .expect(400);

    const errorBody = response.body as { message: string };
    expect(errorBody.message).toBe('Insufficient chips');
  });
});
