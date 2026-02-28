import { Controller, Get, Headers } from '@nestjs/common';
import { GetUserCurrencyUseCase } from '../../usecases/get-user-currency.usecase';
import type { IUserCurrency } from '../../domain/currency.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly getUserCurrencyUseCase: GetUserCurrencyUseCase,
  ) {}

  @Get('currency')
  async getUserCurrency(
    @Headers('authorization') authorization: string,
  ): Promise<IUserCurrency> {
    const token = authorization?.replace('Bearer ', '');
    return await this.getUserCurrencyUseCase.execute(token);
  }
}
