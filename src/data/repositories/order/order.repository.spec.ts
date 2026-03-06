/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Model } from 'mongoose';
import { Order } from '../../schemas/order.schema';
import { OrderRepository } from './order.repository';
import { EOrderType } from '../../../domain/order.interface';

describe('OrderRepository', () => {
  const exec = jest.fn();
  const lean = jest.fn();
  const select = jest.fn();
  const session = jest.fn();
  const find = jest.fn();
  const create = jest.fn();
  const findByIdAndDelete = jest.fn();
  const findById = jest.fn();

  let repository: OrderRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    lean.mockReturnValue({ exec });
    select.mockReturnValue({ lean });
    session.mockReturnValue({ exec });
    find.mockReturnValue({ select });
    findByIdAndDelete.mockReturnValue({ session });
    findById.mockReturnValue({ lean });

    const orderModel = {
      find,
      create,
      findByIdAndDelete,
      findById,
    } as unknown as Model<Order>;

    repository = new OrderRepository(orderModel);
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
      _id: 1,
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

  it('should create order and return payload with userId', async () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const fulfilledAt = new Date('2026-01-01T01:00:00.000Z');

    create.mockResolvedValue({
      userId: 'user-1',
      type: EOrderType.Ship,
      createdAt,
      fulfilledAt,
    });

    const result = await repository.createOrder({
      userId: 'user-1',
      type: EOrderType.Ship,
      fulfilledAt,
    });

    expect(create).toHaveBeenCalledTimes(1);
    expect(result.type).toBe(EOrderType.Ship);
    expect(result.createdAt).toBe(createdAt);
    expect(result.fulfilledAt).toBe(fulfilledAt);
    expect(result.userId).toBe('user-1');
  });

  it('should remove order by id', async () => {
    exec.mockResolvedValue(null);

    await repository.removeOrderById('order-1');

    expect(findByIdAndDelete).toHaveBeenCalledWith('order-1');
    expect(session).toHaveBeenCalledWith(null);
    expect(exec).toHaveBeenCalledTimes(1);
  });

  it('should remove order by id with session', async () => {
    const mongoSession = {} as any;
    exec.mockResolvedValue(null);

    await repository.removeOrderById('order-1', mongoSession);

    expect(findByIdAndDelete).toHaveBeenCalledWith('order-1');
    expect(session).toHaveBeenCalledWith(mongoSession);
    expect(exec).toHaveBeenCalledTimes(1);
  });

  it('should return order when found by id', async () => {
    const order = {
      userId: 'user-1',
      type: EOrderType.Sheep,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      fulfilledAt: new Date('2026-01-01T01:00:00.000Z'),
    };
    exec.mockResolvedValue(order);

    const result = await repository.getOrderById('order-1');

    expect(findById).toHaveBeenCalledWith('order-1');
    expect(result).toEqual(order);
  });

  it('should return null when order is not found by id', async () => {
    exec.mockResolvedValue(null);

    const result = await repository.getOrderById('non-existent');

    expect(findById).toHaveBeenCalledWith('non-existent');
    expect(result).toBeNull();
  });
});
