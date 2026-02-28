import { GetUserCurrencyUseCase } from './get-user-currency.usecase';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { UserRepository } from '../../data/repositories/user/user.repository';

describe('GetUserCurrencyUseCase', () => {
  const getUserCurrency = jest.fn();
  const addUserCurrency = jest.fn();
  const decodeExecute = jest.fn();

  let useCase: GetUserCurrencyUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new GetUserCurrencyUseCase(
      {
        getUserCurrency,
        addUserCurrency,
      } as unknown as UserRepository,
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
    expect(addUserCurrency).not.toHaveBeenCalled();
    expect(result).toEqual({ userId: 'user-1', chip: 100, cash: 50 });
  });

  it('should create currency when user has no currency yet', async () => {
    decodeExecute.mockResolvedValue({ id: 'user-2' });
    getUserCurrency.mockResolvedValue(null);
    addUserCurrency.mockResolvedValue({ userId: 'user-2', chip: 0, cash: 0 });

    const result = await useCase.execute('token-2');

    expect(getUserCurrency).toHaveBeenCalledWith('user-2');
    expect(addUserCurrency).toHaveBeenCalledWith({
      userId: 'user-2',
      chip: 0,
      cash: 0,
    });
    expect(result).toEqual({ userId: 'user-2', chip: 0, cash: 0 });
  });
});
