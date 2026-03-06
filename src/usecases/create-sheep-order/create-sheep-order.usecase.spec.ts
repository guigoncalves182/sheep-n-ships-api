import { EOrderType } from '../../domain/order.interface';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { CurrencyRepository } from '../../data/repositories/currency/currency.repository';
import { OrderRepository } from '../../data/repositories/order/order.repository';
import { GetUserCurrencyUseCase } from '../get-user-currency/get-user-currency.usecase';
import { CreateSheepOrderUseCase } from './create-sheep-order.usecase';
import { BadRequestException } from '@nestjs/common';
import { CONFIGURATIONS } from '../../domain/constants/configurations.constants';

const BASE_TIME_MS = CONFIGURATIONS.costs.orders.sheep.time * 60 * 1000;

describe('CreateSheepOrder', () => {
  const createOrder = jest.fn();
  const decodeExecute = jest.fn();
  const incrementUserCurrency = jest.fn();
  const getUserCurrencyExecute = jest.fn();

  let useCase: CreateSheepOrderUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new CreateSheepOrderUseCase(
      { execute: decodeExecute } as unknown as DecodeTokenService,
      { createOrder } as unknown as OrderRepository,
      { incrementUserCurrency } as unknown as CurrencyRepository,
      { execute: getUserCurrencyExecute } as unknown as GetUserCurrencyUseCase,
    );
  });

  it('should decode token and create sheep order with fulfilledAt based on TIME_RATE', async () => {
    const fixedNow = new Date('2026-01-01T00:00:00.000Z').getTime();
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(fixedNow);

    process.env.TIME_RATE = '2';
    process.env.COST_RATE = '1';
    decodeExecute.mockResolvedValue({ id: 'user-1' });
    getUserCurrencyExecute.mockResolvedValue({
      userId: 'user-1',
      chip: 100,
      cash: 0,
    });
    createOrder.mockResolvedValue({
      userId: 'user-1',
      type: EOrderType.Sheep,
      createdAt: new Date(fixedNow),
      fulfilledAt: new Date(fixedNow + BASE_TIME_MS * 2),
    });

    const result = await useCase.execute('token-1');

    expect(decodeExecute).toHaveBeenCalledWith('token-1');
    expect(getUserCurrencyExecute).toHaveBeenCalledWith('token-1');
    expect(incrementUserCurrency).toHaveBeenCalledWith({
      userId: 'user-1',
      chip: -100,
    });
    expect(createOrder).toHaveBeenCalledWith({
      userId: 'user-1',
      type: EOrderType.Sheep,
      fulfilledAt: new Date(fixedNow + BASE_TIME_MS * 2),
    });
    expect(result.type).toBe(EOrderType.Sheep);
    expect(result.userId).toBe('user-1');

    nowSpy.mockRestore();
  });

  it('should use base time from config when TIME_RATE is 1', async () => {
    const fixedNow = new Date('2026-01-01T00:00:00.000Z').getTime();
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(fixedNow);

    process.env.TIME_RATE = '1';
    process.env.COST_RATE = '1';
    decodeExecute.mockResolvedValue({ id: 'user-2' });
    getUserCurrencyExecute.mockResolvedValue({
      userId: 'user-2',
      chip: 100,
      cash: 0,
    });
    createOrder.mockResolvedValue({
      userId: 'user-2',
      type: EOrderType.Sheep,
      createdAt: new Date(fixedNow),
      fulfilledAt: new Date(fixedNow + BASE_TIME_MS * 1),
    });

    await useCase.execute('token-2');

    expect(createOrder).toHaveBeenCalledWith({
      userId: 'user-2',
      type: EOrderType.Sheep,
      fulfilledAt: new Date(fixedNow + BASE_TIME_MS * 1),
    });

    nowSpy.mockRestore();
  });

  it('should throw BadRequestException when user has insufficient chips', async () => {
    process.env.COST_RATE = '1';
    decodeExecute.mockResolvedValue({ id: 'user-3' });
    getUserCurrencyExecute.mockResolvedValue({
      userId: 'user-3',
      chip: 10,
      cash: 0,
    });

    await expect(useCase.execute('token-3')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(incrementUserCurrency).not.toHaveBeenCalled();
    expect(createOrder).not.toHaveBeenCalled();
  });
});
