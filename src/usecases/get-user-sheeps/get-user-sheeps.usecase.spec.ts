import { SheepRepository } from '../../data/repositories/sheep/sheep.repository';
import { ERarity } from '../../domain/sheep.interface';
import { GetUserSheepsUseCase } from './get-user-sheeps.usecase';

describe('GetUserSheepsUseCase', () => {
  const getAllSheeps = jest.fn();

  let useCase: GetUserSheepsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new GetUserSheepsUseCase({
      getAllSheeps,
    } as unknown as SheepRepository);
  });

  it('should return all sheeps', async () => {
    getAllSheeps.mockResolvedValue([
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

    const result = await useCase.execute();

    expect(getAllSheeps).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[1]?.rarity).toBe(ERarity.Rare);
  });

  it('should return empty array when there are no sheeps', async () => {
    getAllSheeps.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(getAllSheeps).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});
