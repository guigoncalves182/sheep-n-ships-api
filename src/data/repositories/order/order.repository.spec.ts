import { Model } from 'mongoose';
import { EOrderType, Order } from '../../schemas/order.schema';
import { OrderRepository } from './order.repository';

describe('OrderRepository', () => {
  const exec = jest.fn();
  const lean = jest.fn();
  const select = jest.fn();
  const find = jest.fn();

  let repository: OrderRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    lean.mockReturnValue({ exec });
    select.mockReturnValue({ lean });
    find.mockReturnValue({ select });

    repository = new OrderRepository({ find } as unknown as Model<Order>);
  });

  it('should query user orders and return mapped response', async () => {
    exec.mockResolvedValue([
      {
        userId: 'user-1',
        type: EOrderType.Sheep,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        fulfilledAt: new Date('2026-01-01T01:00:00.000Z'),
      },
    ]);

    const result = await repository.getUserOrders('user-1');

    expect(find).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(select).toHaveBeenCalledWith({
      _id: 0,
      userId: 1,
      type: 1,
      createdAt: 1,
      fulfilledAt: 1,
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.type).toBe(EOrderType.Sheep);
  });

  it('should return empty array when no orders are found', async () => {
    exec.mockResolvedValue([]);

    const result = await repository.getUserOrders('unknown-user');

    expect(result).toEqual([]);
  });
});
