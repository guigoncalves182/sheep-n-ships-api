import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { SystemController } from './system.controller';

describe('SystemController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SystemController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / should return system status', async () => {
    const httpServer = app.getHttpServer() as App;
    const response = await request(httpServer).get('/').expect(200);
    const body = response.body as {
      status: string;
      environment: string;
      startedAt: string;
    };

    expect(body.status).toBe('ok');
    expect(body.environment).toBe(process.env.NODE_ENV || 'development');
    expect(typeof body.startedAt).toBe('string');
    expect(Number.isNaN(Date.parse(body.startedAt))).toBe(false);
  });
});
