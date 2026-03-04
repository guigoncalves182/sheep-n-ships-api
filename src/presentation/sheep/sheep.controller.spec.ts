import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { ERarity } from '../../domain/sheep.interface';
import { ClaimSheep } from '../../usecases/claim-sheep/claim-sheep.usecase';
import { GetUserSheepsUseCase } from '../../usecases/get-user-sheeps/get-user-sheeps.usecase';
import { SheepController } from './sheep.controller';

describe('SheepController', () => {
  let app: INestApplication;
  const executeClaimSheep = jest.fn();
  const executeGetUserSheeps = jest.fn();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SheepController],
      providers: [
        {
          provide: ClaimSheep,
          useValue: { execute: executeClaimSheep },
        },
        {
          provide: GetUserSheepsUseCase,
          useValue: { execute: executeGetUserSheeps },
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

  it('GET /sheep should return all sheeps', async () => {
    executeGetUserSheeps.mockResolvedValue([
      {
        userId: 'user-1',
        rarity: ERarity.Common,
        hitPoint: 10,
        attack: 5,
        defense: 4,
        speed: 3,
        evasion: 2,
        accuracy: 1,
      },
    ]);

    const httpServer = app.getHttpServer() as App;
    const response = await request(httpServer).get('/sheep').expect(200);

    expect(executeGetUserSheeps).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual([
      {
        userId: 'user-1',
        rarity: ERarity.Common,
        hitPoint: 10,
        attack: 5,
        defense: 4,
        speed: 3,
        evasion: 2,
        accuracy: 1,
      },
    ]);
  });

  it('POST /sheep/claim should call use case with bearer token and return payload', async () => {
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
      .post('/sheep/claim/order-123')
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
});
