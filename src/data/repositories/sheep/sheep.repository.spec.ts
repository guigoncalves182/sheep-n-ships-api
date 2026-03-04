import { Model } from 'mongoose';
import { ERarity } from '../../../domain/sheep.interface';
import { Sheep } from '../../schemas/sheep.schema';
import { SheepRepository } from './sheep.repository';

describe('SheepRepository', () => {
  const exec = jest.fn();
  const lean = jest.fn();
  const find = jest.fn();
  const create = jest.fn();

  let repository: SheepRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    lean.mockReturnValue({ exec });
    find.mockReturnValue({ lean });

    const sheepModel = {
      find,
      create,
    } as unknown as Model<Sheep>;

    repository = new SheepRepository(sheepModel);
  });

  describe('getUserSheeps', () => {
    it('should query user sheeps and return mapped response', async () => {
      exec.mockResolvedValue([
        {
          userId: 'user-1',
          rarity: ERarity.Epic,
          hitPoint: 120,
          attack: 40,
          defense: 28,
          speed: 22,
          evasion: 10,
          accuracy: 18,
        },
      ]);

      const result = await repository.getUserSheeps('user-1');

      expect(find).toHaveBeenCalledWith({ userId: 'user-1' });
      expect(result).toHaveLength(1);
      expect(result[0]?.rarity).toBe(ERarity.Epic);
      expect(result[0]?.userId).toBe('user-1');
    });

    it('should return empty array when user has no sheeps', async () => {
      exec.mockResolvedValue([]);

      const result = await repository.getUserSheeps('unknown-user');

      expect(find).toHaveBeenCalledWith({ userId: 'unknown-user' });
      expect(result).toEqual([]);
    });
  });

  describe('getAllSheeps', () => {
    it('should query all sheeps and return mapped response', async () => {
      exec.mockResolvedValue([
        {
          userId: 'user-1',
          rarity: ERarity.Common,
          hitPoint: 100,
          attack: 20,
          defense: 10,
          speed: 15,
          evasion: 5,
          accuracy: 8,
        },
        {
          userId: 'user-2',
          rarity: ERarity.Legendary,
          hitPoint: 180,
          attack: 45,
          defense: 30,
          speed: 25,
          evasion: 12,
          accuracy: 20,
        },
      ]);

      const result = await repository.getAllSheeps();

      expect(find).toHaveBeenCalledWith({});
      expect(result).toHaveLength(2);
      expect(result[1]?.rarity).toBe(ERarity.Legendary);
    });

    it('should return empty array when there are no sheeps', async () => {
      exec.mockResolvedValue([]);

      const result = await repository.getAllSheeps();

      expect(find).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });
  });

  describe('createSheep', () => {
    it('should create sheep and return created payload', async () => {
      const payload = {
        userId: 'user-1',
        rarity: ERarity.Rare,
        hitPoint: 95,
        attack: 30,
        defense: 22,
        speed: 20,
        evasion: 12,
        accuracy: 17,
      };

      create.mockResolvedValue([payload]);

      const result = await repository.createSheep(payload);

      expect(create).toHaveBeenCalledWith([payload], { session: undefined });
      expect(result).toEqual(payload);
    });
  });
});
