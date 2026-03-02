import { Injectable } from '@nestjs/common';
import type { IUserCurrency } from '../../domain/currency.interface';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { CurrencyRepository } from '../../data/repositories/currency/currency.repository';

interface IGetUserCurrencyUseCase {
  execute(token: string): Promise<IUserCurrency>;
}

@Injectable()
export class GetUserCurrencyUseCase implements IGetUserCurrencyUseCase {
  constructor(
    private readonly userRepository: CurrencyRepository,
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  async execute(token: string): Promise<IUserCurrency> {
    const { id: userId } = await this.decodeTokenService.execute(token);
    let currency = await this.userRepository.getUserCurrency(userId);

    if (!currency) {
      currency = await this.userRepository.addCurrencyToUser({
        userId,
        chip: 0,
        cash: 0,
      });
    }
    return currency;
  }
}
