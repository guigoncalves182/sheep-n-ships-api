import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { ERarity } from '../../domain/sheep.interface';
import { GetUserSheepsUseCase } from '../../usecases/get-user-sheeps/get-user-sheeps.usecase';
import { SheepController } from './sheep.controller';

describe('SheepController', () => {
  let app: INestApplication;
  const executeGetUserSheeps = jest.fn();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SheepController],
      providers: [
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
    const response = await request(httpServer)
      .get('/sheep')
      .set('authorization', 'Bearer token-abc')
      .expect(200);

    expect(executeGetUserSheeps).toHaveBeenCalledWith('token-abc');
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

  it('GET /sheep should call use case with undefined token when header is missing', async () => {
    executeGetUserSheeps.mockResolvedValue([]);

    const httpServer = app.getHttpServer() as App;
    await request(httpServer).get('/sheep').expect(200);

    expect(executeGetUserSheeps).toHaveBeenCalledWith(undefined);
  });
});
