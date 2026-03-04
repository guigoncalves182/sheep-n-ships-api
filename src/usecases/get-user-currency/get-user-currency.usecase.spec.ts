import { GetUserCurrencyUseCase } from './get-user-currency.usecase';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { CurrencyRepository } from '../../data/repositories/currency/currency.repository';

describe('GetUserCurrencyUseCase', () => {
  const getUserCurrency = jest.fn();
  const incrementUserCurrency = jest.fn();
  const decodeExecute = jest.fn();

  let useCase: GetUserCurrencyUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new GetUserCurrencyUseCase(
      {
        getUserCurrency,
        incrementUserCurrency,
      } as unknown as CurrencyRepository,
      { execute: decodeExecute } as unknown as DecodeTokenService,
    );
  });

  it('should return existing currency when user already has currency', async () => {
    decodeExecute.mockResolvedValue({ id: 'user-1' });
    getUserCurrency.mockResolvedValue({
      userId: 'user-1',
      chip: 100,
      cash: 50,
    });

    const result = await useCase.execute('token-1');

    expect(decodeExecute).toHaveBeenCalledWith('token-1');
    expect(getUserCurrency).toHaveBeenCalledWith('user-1');
    expect(incrementUserCurrency).not.toHaveBeenCalled();
    expect(result).toEqual({ userId: 'user-1', chip: 100, cash: 50 });
  });

  it('should create currency when user has no currency yet', async () => {
    decodeExecute.mockResolvedValue({ id: 'user-2' });
    getUserCurrency.mockResolvedValue(null);
    incrementUserCurrency.mockResolvedValue({
      userId: 'user-2',
      chip: 500,
      cash: 50,
    });

    const result = await useCase.execute('token-2');

    expect(getUserCurrency).toHaveBeenCalledWith('user-2');
    expect(incrementUserCurrency).toHaveBeenCalledWith({
      userId: 'user-2',
      chip: 500,
      cash: 50,
    });
    expect(result).toEqual({ userId: 'user-2', chip: 500, cash: 50 });
  });
});
