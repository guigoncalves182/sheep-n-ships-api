import { SheepRepository } from '../../data/repositories/sheep/sheep.repository';
import { ERarity } from '../../domain/sheep.interface';
import { GetUserSheepsUseCase } from './get-user-sheeps.usecase';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';

describe('GetUserSheepsUseCase', () => {
  const getUserSheeps = jest.fn();
  const decodeExecute = jest.fn();

  let useCase: GetUserSheepsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new GetUserSheepsUseCase(
      {
        getUserSheeps,
      } as unknown as SheepRepository,
      { execute: decodeExecute } as unknown as DecodeTokenService,
    );
  });

  it('should return all sheeps', async () => {
    getUserSheeps.mockResolvedValue([
      {
        userId: 'user-1',
        rarity: ERarity.Common,
        hitPoint: 10,
        attack: 5,
        defense: 4,
        speed: 3,
        evasion: 2,
        accuracy: 1,
      },
      {
        userId: 'user-2',
        rarity: ERarity.Rare,
        hitPoint: 20,
        attack: 8,
        defense: 7,
        speed: 6,
        evasion: 5,
        accuracy: 4,
      },
    ]);

    decodeExecute.mockResolvedValue({ id: 'user-2' });

    const result = await useCase.execute('user-2');

    expect(decodeExecute).toHaveBeenCalledTimes(1);
    expect(getUserSheeps).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[1]?.rarity).toBe(ERarity.Rare);
  });

  it('should return empty array when there are no sheeps', async () => {
    getUserSheeps.mockResolvedValue([]);

    decodeExecute.mockResolvedValue({ id: 'user-1' });

    const result = await useCase.execute('user-1');

    expect(decodeExecute).toHaveBeenCalledTimes(1);
    expect(getUserSheeps).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});
