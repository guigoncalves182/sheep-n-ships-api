import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Currency } from '../../schemas/currency.schema';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  const exec = jest.fn();
  const lean = jest.fn();
  const select = jest.fn();
  const findOne = jest.fn();
  const findOneAndUpdate = jest.fn();

  let repository: UserRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    lean.mockReturnValue({ exec });
    select.mockReturnValue({ lean });
    findOne.mockReturnValue({ select });

    repository = new UserRepository({
      findOne,
      findOneAndUpdate,
    } as unknown as Model<Currency>);
  });

  describe('getUserCurrency', () => {
    it('should query user currency and return mapped response', async () => {
      exec.mockResolvedValue({ userId: 'user-1', chip: 30, cash: 10 });

      const result = await repository.getUserCurrency('user-1');

      expect(findOne).toHaveBeenCalledWith({ userId: 'user-1' });
      expect(select).toHaveBeenCalledWith({
        _id: 0,
        userId: 1,
        chip: 1,
        cash: 1,
      });
      expect(result).toEqual({ userId: 'user-1', chip: 30, cash: 10 });
    });

    it('should return null when user currency is not found', async () => {
      exec.mockResolvedValue(null);

      const result = await repository.getUserCurrency('unknown-user');

      expect(result).toBeNull();
    });
  });

  describe('addUserCurrency', () => {
    it('should throw when chip or cash is negative', async () => {
      await expect(
        repository.addUserCurrency({ userId: 'user-1', chip: -1, cash: 0 }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should upsert and return mapped currency', async () => {
      findOneAndUpdate.mockResolvedValue({
        userId: 'user-1',
        chip: 15,
        cash: 5,
      } as Currency);

      const result = await repository.addUserCurrency({
        userId: 'user-1',
        chip: 15,
        cash: 5,
      });

      expect(findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 'user-1' },
        {
          $inc: { chip: 15, cash: 5 },
          $setOnInsert: { userId: 'user-1' },
        },
        { upsert: true, new: true },
      );
      expect(result).toEqual({ userId: 'user-1', chip: 15, cash: 5 });
    });

    it('should default missing chip and cash to zero', async () => {
      findOneAndUpdate.mockResolvedValue({
        userId: 'user-2',
        chip: 0,
        cash: 0,
      } as Currency);

      const result = await repository.addUserCurrency({ userId: 'user-2' });

      expect(findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 'user-2' },
        {
          $inc: { chip: 0, cash: 0 },
          $setOnInsert: { userId: 'user-2' },
        },
        { upsert: true, new: true },
      );
      expect(result).toEqual({ userId: 'user-2', chip: 0, cash: 0 });
    });
  });
});
