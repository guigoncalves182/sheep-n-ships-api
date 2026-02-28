import { Injectable } from '@nestjs/common';
import type { IUserCurrency } from '../../domain/currency.interface';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { UserRepository } from '../../data/repositories/user/user.repository';

interface IGetUserCurrencyUseCase {
  execute(token: string): Promise<IUserCurrency>;
}

@Injectable()
export class GetUserCurrencyUseCase implements IGetUserCurrencyUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  async execute(token: string): Promise<IUserCurrency> {
    const { id: userId } = await this.decodeTokenService.execute(token);
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
