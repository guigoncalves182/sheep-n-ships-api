import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection } from 'mongoose';
import { GenerateSheepService } from 'src/app/services/generate-sheep/generate-sheep.service';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { OrderRepository } from '../../data/repositories/order/order.repository';
import { ERarity } from '../../domain/sheep.interface';
import { ClaimSheep } from './claim-sheep.usecase';

describe('ClaimSheep', () => {
  const getOrderById = jest.fn();
  const removeOrderById = jest.fn();
  const decodeExecute = jest.fn();
  const generateSheepExecute = jest.fn();
  const endSession = jest.fn();
  const withTransaction = jest.fn();
  const startSession = jest.fn();

  const VALID_ORDER_ID = '507f1f77bcf86cd799439011';

  const mockSheep = {
    userId: 'user-1',
    rarity: ERarity.Common,
    hitPoint: 100,
    attack: 50,
    defense: 40,
    speed: 30,
    evasion: 20,
    accuracy: 10,
  };

  let useCase: ClaimSheep;

  beforeEach(() => {
    jest.clearAllMocks();

    startSession.mockResolvedValue({ withTransaction, endSession });
    withTransaction.mockImplementation((fn: () => Promise<unknown>) => fn());

    useCase = new ClaimSheep(
      { startSession } as unknown as Connection,
      { execute: decodeExecute } as unknown as DecodeTokenService,
      { getOrderById, removeOrderById } as unknown as OrderRepository,
      { execute: generateSheepExecute } as unknown as GenerateSheepService,
    );
  });

  it('should throw BadRequestException when orderId is not a valid ObjectId', async () => {
    await expect(useCase.execute('token', 'invalid-id')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(getOrderById).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order is not found', async () => {
    getOrderById.mockResolvedValue(null);

    await expect(
      useCase.execute('token', VALID_ORDER_ID),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(decodeExecute).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when order does not belong to the user', async () => {
    getOrderById.mockResolvedValue({ userId: 'other-user' });
    decodeExecute.mockResolvedValue({ id: 'user-1' });

    await expect(
      useCase.execute('token', VALID_ORDER_ID),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(startSession).not.toHaveBeenCalled();
  });

  it('should create sheep and remove order inside a transaction and return the sheep', async () => {
    getOrderById.mockResolvedValue({
      userId: 'user-1',
      fulfilledAt: new Date(Date.now() - 1000),
    });
    decodeExecute.mockResolvedValue({ id: 'user-1' });
    generateSheepExecute.mockResolvedValue(mockSheep);
    removeOrderById.mockResolvedValue(undefined);

    const result = await useCase.execute('token', VALID_ORDER_ID);

    expect(startSession).toHaveBeenCalledTimes(1);
    expect(withTransaction).toHaveBeenCalledTimes(1);
    expect(generateSheepExecute).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ withTransaction, endSession }),
    );
    expect(removeOrderById).toHaveBeenCalledWith(
      VALID_ORDER_ID,
      expect.objectContaining({ withTransaction, endSession }),
    );
    expect(endSession).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockSheep);
  });

  it('should call endSession even when transaction throws', async () => {
    getOrderById.mockResolvedValue({
      userId: 'user-1',
      fulfilledAt: new Date(Date.now() - 1000),
    });
    decodeExecute.mockResolvedValue({ id: 'user-1' });
    withTransaction.mockRejectedValue(new Error('DB error'));

    await expect(
      useCase.execute('token', VALID_ORDER_ID),
    ).rejects.toBeInstanceOf(InternalServerErrorException);

    expect(endSession).toHaveBeenCalledTimes(1);
  });
});
