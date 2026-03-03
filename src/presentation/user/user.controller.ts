import { Controller, Get, Headers, Post } from '@nestjs/common';
import { GetUserCurrencyUseCase } from '../../usecases/get-user-currency/get-user-currency.usecase';
import type { IUserCurrency } from '../../domain/currency.interface';
import { GetUserOrdersUseCase } from '../../usecases/get-user-orders/get-user-orders.usecase';
import type { IUserOrder } from '../../domain/order.interface';
import { CreateSheepOrder } from '../../usecases/create-sheep-order/create-sheep-order';

@Controller('user')
export class UserController {
  constructor(
    private readonly getUserCurrencyUseCase: GetUserCurrencyUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
    private readonly createSheepOrderUseCase: CreateSheepOrder,
  ) {}

  @Get('currency')
  async getUserCurrency(
    @Headers('authorization') authorization: string,
  ): Promise<IUserCurrency> {
    const token = authorization?.replace('Bearer ', '');
    return await this.getUserCurrencyUseCase.execute(token);
  }

  @Get('orders')
  async getUserOrders(
    @Headers('authorization') authorization: string,
  ): Promise<IUserOrder[]> {
    const token = authorization?.replace('Bearer ', '');
    return await this.getUserOrdersUseCase.execute(token);
  }

  @Post('orders/sheep')
  async createSheepOrder(
    @Headers('authorization') authorization: string,
  ): Promise<IUserOrder> {
    const token = authorization?.replace('Bearer ', '');
    return await this.createSheepOrderUseCase.execute(token);
  }
}
