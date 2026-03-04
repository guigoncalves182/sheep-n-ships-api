import { Injectable } from '@nestjs/common';
import type { IUserCurrency } from '../../domain/currency.interface';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { CurrencyRepository } from '../../data/repositories/currency/currency.repository';
import { CONFIGURATIONS } from 'src/domain/constants/configurations.constants';

interface IGetUserCurrencyUseCase {
  execute(token: string): Promise<IUserCurrency>;
}

@Injectable()
export class GetUserCurrencyUseCase implements IGetUserCurrencyUseCase {
  constructor(
    private readonly currencyRepository: CurrencyRepository,
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  async execute(token: string): Promise<IUserCurrency> {
    const { id: userId } = await this.decodeTokenService.execute(token);
    let currency = await this.currencyRepository.getUserCurrency(userId);

    if (!currency) {
      currency = await this.currencyRepository.incrementUserCurrency({
        userId,
        chip: CONFIGURATIONS.user.initialCurrency.chip,
        cash: CONFIGURATIONS.user.initialCurrency.cash,
      });
    }
    return currency;
  }
}
