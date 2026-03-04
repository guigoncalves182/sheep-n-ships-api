import { EOrderType } from '../../domain/order.interface';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { OrderRepository } from '../../data/repositories/order/order.repository';
import { GetUserOrdersUseCase } from './get-user-orders.usecase';

describe('GetUserOrdersUseCase', () => {
  const getUserOrders = jest.fn();
  const decodeExecute = jest.fn();

  let useCase: GetUserOrdersUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new GetUserOrdersUseCase(
      { getUserOrders } as unknown as OrderRepository,
      { execute: decodeExecute } as unknown as DecodeTokenService,
    );
  });

  it('should decode token and return user orders', async () => {
    decodeExecute.mockResolvedValue({ id: 'user-1' });
    getUserOrders.mockResolvedValue([
      {
        userId: 'user-1',
        type: EOrderType.Sheep,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        fulfilledAt: new Date('2026-01-01T01:00:00.000Z'),
      },
    ]);

    const result = await useCase.execute('token-1');

    expect(decodeExecute).toHaveBeenCalledWith('token-1');
    expect(getUserOrders).toHaveBeenCalledWith('user-1');
    expect(result).toHaveLength(1);
    expect(result[0]?.type).toBe(EOrderType.Sheep);
  });

  it('should return empty array when user has no orders', async () => {
    decodeExecute.mockResolvedValue({ id: 'user-2' });
    getUserOrders.mockResolvedValue([]);

    const result = await useCase.execute('token-2');

    expect(getUserOrders).toHaveBeenCalledWith('user-2');
    expect(result).toEqual([]);
  });
});
