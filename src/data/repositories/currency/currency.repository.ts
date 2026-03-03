import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency } from '../../schemas/currency.schema';
import type { IUserCurrency } from '../../../domain/currency.interface';

interface IIncrementUserCurrency {
  userId: string;
  chip?: number;
  cash?: number;
}

@Injectable()
export class CurrencyRepository {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<Currency>,
  ) {}

  async getUserCurrency(userId: string): Promise<IUserCurrency | null> {
    const currency = await this.currencyModel
      .findOne({ userId })
      .select({ _id: 1, userId: 1, chip: 1, cash: 1 })
      .lean<Currency>()
      .exec();

    if (!currency) {
      return null;
    }

    return currency;
  }

  async incrementUserCurrency(
    params: IIncrementUserCurrency,
  ): Promise<IUserCurrency> {
    const userId: string = params.userId;
    const chip: number = params.chip ?? 0;
    const cash: number = params.cash ?? 0;

    const updated = await this.currencyModel.findOneAndUpdate(
      { userId },
      {
        $inc: { chip, cash },
        $setOnInsert: { userId },
      },
      { upsert: true, returnDocument: 'after' },
    );

    return updated;
  }
}
