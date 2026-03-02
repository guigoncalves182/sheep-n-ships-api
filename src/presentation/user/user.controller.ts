import { Controller, Get, Headers } from '@nestjs/common';
import { GetUserCurrencyUseCase } from '../../usecases/get-user-currency/get-user-currency.usecase';
import type { IUserCurrency } from '../../domain/currency.interface';
import { GetUserOrdersUseCase } from '../../usecases/get-user-orders/get-user-orders.usecase';
import type { IUserOrder } from '../../domain/order.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly getUserCurrencyUseCase: GetUserCurrencyUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
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
}
