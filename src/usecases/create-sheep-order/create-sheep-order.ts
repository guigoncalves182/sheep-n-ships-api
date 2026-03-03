import { BadRequestException, Injectable } from '@nestjs/common';
import { COSTS } from '../../domain/constants/costs.constants';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { OrderRepository } from '../../data/repositories/order/order.repository';
import { EOrderType } from '../../data/schemas/order.schema';
import { IUserOrder } from '../../domain/order.interface';
import { GetUserCurrencyUseCase } from '../get-user-currency/get-user-currency.usecase';
import { CurrencyRepository } from '../../data/repositories/currency/currency.repository';

interface ICreateSheepOrder {
  execute(token: string): Promise<IUserOrder>;
}

@Injectable()
export class CreateSheepOrder implements ICreateSheepOrder {
  constructor(
    private readonly decodeTokenService: DecodeTokenService,
    private readonly orderRepository: OrderRepository,
    private readonly currencyRepository: CurrencyRepository,
    private readonly getUserCurrency: GetUserCurrencyUseCase,
  ) {}

  async execute(token: string): Promise<IUserOrder> {
    const sheepCost = COSTS.orders.sheep.chip * Number(process.env.COST_RATE);

    const { id: userId } = await this.decodeTokenService.execute(token);
    const { chip } = await this.getUserCurrency.execute(token);

    if (chip < sheepCost) throw new BadRequestException('Insufficient chips');

    await this.currencyRepository.incrementUserCurrency({
      userId,
      chip: -sheepCost,
    });

    const timeRate = Number(process.env.TIME_RATE);
    const fulfilledAt = new Date(Date.now() + 15 * 60 * 1000 * timeRate);

    const order = await this.orderRepository.createOrder({
      userId,
      type: EOrderType.Sheep,
      fulfilledAt,
    });

    return order;
  }
}
