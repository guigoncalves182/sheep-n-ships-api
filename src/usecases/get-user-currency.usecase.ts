import { Injectable } from '@nestjs/common';
import type { IUserCurrency } from '../domain/currency.interface';
import { UserRepository } from '../data/repositories/user.repository';
import { DecodeTokenUseCase } from './decode-token.usecase';

interface IGetUserCurrencyUseCase {
  execute(token: string): Promise<IUserCurrency>;
}

@Injectable()
export class GetUserCurrencyUseCase implements IGetUserCurrencyUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly decodeTokenUseCase: DecodeTokenUseCase,
  ) {}

  async execute(token: string): Promise<IUserCurrency> {
    const { id: userId } = await this.decodeTokenUseCase.execute(token);
    let currency = await this.userRepository.getUserCurrency(userId);

    if (!currency) {
      currency = await this.userRepository.addUserCurrency({
        userId,
        chip: 0,
        cash: 0,
      });
    }
    return currency;
  }
}
