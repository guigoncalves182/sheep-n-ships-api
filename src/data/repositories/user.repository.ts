import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IUserCurrency } from '../../domain/currency.interface';
import { Currency } from '../schemas/currency.schema';

interface IAddCurrencyParams {
  userId: string;
  chip?: number;
  cash?: number;
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<Currency>,
  ) {}

  async getUserCurrency(userId: string): Promise<IUserCurrency | null> {
    const currency = await this.currencyModel
      .findOne({ userId })
      .select({ _id: 0, userId: 1, chip: 1, cash: 1 })
      .lean<Currency>()
      .exec();

    if (!currency) {
      return null;
    }

    return {
      userId: currency.userId,
      chip: currency.chip,
      cash: currency.cash,
    };
  }

  async addUserCurrency(params: IAddCurrencyParams): Promise<IUserCurrency> {
    const userId: string = params.userId;
    const chip: number = params.chip ?? 0;
    const cash: number = params.cash ?? 0;

    if (chip < 0 || cash < 0)
      throw new BadRequestException(
        'Chip and cash values must be positive numbers',
      );

    const updated = await this.currencyModel.findOneAndUpdate(
      { userId },
      {
        $inc: { chip, cash },
        $setOnInsert: { userId },
      },
      { upsert: true, new: true },
    );

    return {
      userId: updated.userId,
      chip: updated.chip,
      cash: updated.cash,
    };
  }
}
