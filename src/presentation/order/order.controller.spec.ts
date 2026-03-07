import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { ERarity } from '../../domain/sheep.interface';
import { ClaimSheep } from '../../usecases/claim-sheep/claim-sheep.usecase';
import { OrderController } from './order.controller';

describe('OrderController', () => {
  let app: INestApplication;
  const executeClaimSheep = jest.fn();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: ClaimSheep,
          useValue: { execute: executeClaimSheep },
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

  it('POST /order/claim/sheep/:orderId should call use case with bearer token and return payload', async () => {
    executeClaimSheep.mockResolvedValue({
      userId: 'user-1',
      rarity: ERarity.Rare,
      hitPoint: 20,
      attack: 10,
      defense: 8,
      speed: 7,
      evasion: 6,
      accuracy: 5,
    });

    const httpServer = app.getHttpServer() as App;
    const response = await request(httpServer)
      .post('/order/claim/sheep/order-123')
      .set('authorization', 'Bearer token-abc')
      .expect(201);

    expect(executeClaimSheep).toHaveBeenCalledWith('token-abc', 'order-123');
    expect(response.body).toEqual({
      userId: 'user-1',
      rarity: ERarity.Rare,
      hitPoint: 20,
      attack: 10,
      defense: 8,
      speed: 7,
      evasion: 6,
      accuracy: 5,
    });
  });

  it('POST /order/claim/sheep/:orderId should call use case with undefined token when header is missing', async () => {
    executeClaimSheep.mockResolvedValue({
      userId: 'user-1',
      rarity: ERarity.Common,
      hitPoint: 10,
      attack: 5,
      defense: 4,
      speed: 3,
      evasion: 2,
      accuracy: 1,
    });

    const httpServer = app.getHttpServer() as App;
    await request(httpServer).post('/order/claim/sheep/order-123').expect(201);

    expect(executeClaimSheep).toHaveBeenCalledWith(undefined, 'order-123');
  });
});
