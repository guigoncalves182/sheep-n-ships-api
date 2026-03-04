import { ClientSession } from 'mongoose';
import { CONFIGURATIONS } from '../../../domain/constants/configurations.constants';
import { SheepRepository } from '../../../data/repositories/sheep/sheep.repository';
import { ERarity } from '../../../domain/sheep.interface';
import { GenerateSheepService } from './generate-sheep.service';

const { minStatTotal, maxStatTotal } =
  CONFIGURATIONS.sheepGeneration.statConfig;
const statRange = maxStatTotal - minStatTotal;

describe('GenerateSheepService', () => {
  const createSheep = jest.fn();

  let service: GenerateSheepService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new GenerateSheepService({
      createSheep,
    } as unknown as SheepRepository);
  });

  describe('rarity based on roll', () => {
    const rarityBoundaryCases =
      CONFIGURATIONS.sheepGeneration.rarityConfig.flatMap(
        ({ rarity, minRoll }, i) => {
          const maxRoll =
            i === 0
              ? 999
              : CONFIGURATIONS.sheepGeneration.rarityConfig[i - 1].minRoll - 1;
          return [
            [minRoll, rarity],
            [maxRoll, rarity],
          ] as [number, ERarity][];
        },
      );

    it.each(rarityBoundaryCases)(
      'roll %i should yield rarity %s',
      async (roll, expectedRarity) => {
        jest.spyOn(Math, 'random').mockReturnValue(roll / 1000);
        createSheep.mockResolvedValue({});

        await service.execute('user-1');

        const [params] = createSheep.mock.calls[0] as [{ rarity: ERarity }];
        expect(params.rarity).toBe(expectedRarity);
      },
    );
  });

  describe('stat distribution', () => {
    it('should distribute statTotal across the 6 stats so their sum equals the computed statTotal', async () => {
      const roll = 600;
      let callCount = 0;
      jest.spyOn(Math, 'random').mockImplementation(() => {
        if (callCount++ === 0) return 0.6; // roll = Math.floor(0.6 * 1000) = 600
        return 0.5;
      });
      createSheep.mockResolvedValue({});

      await service.execute('user-1');

      const [params] = createSheep.mock.calls[0] as [
        Record<string, number> & { rarity: ERarity },
      ];
      const total =
        params.hitPoint +
        params.attack +
        params.defense +
        params.speed +
        params.evasion +
        params.accuracy;

      const expectedStatTotal =
        minStatTotal + Math.floor((roll * statRange) / 999);
      expect(total).toBe(expectedStatTotal);
    });

    it(`should yield statTotal of ${minStatTotal} when roll is 0`, async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      createSheep.mockResolvedValue({});

      await service.execute('user-1');

      const [params] = createSheep.mock.calls[0] as [Record<string, number>];
      const total =
        params.hitPoint +
        params.attack +
        params.defense +
        params.speed +
        params.evasion +
        params.accuracy;

      expect(total).toBe(minStatTotal);
    });

    it(`should yield statTotal of ${maxStatTotal} when roll is 999`, async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.999);
      createSheep.mockResolvedValue({});

      await service.execute('user-1');

      const [params] = createSheep.mock.calls[0] as [Record<string, number>];
      const total =
        params.hitPoint +
        params.attack +
        params.defense +
        params.speed +
        params.evasion +
        params.accuracy;

      expect(total).toBe(maxStatTotal);
    });

    it('each stat should be >= 0', async () => {
      createSheep.mockResolvedValue({});

      await service.execute('user-1');

      const [params] = createSheep.mock.calls[0] as [Record<string, number>];
      for (const stat of [
        'hitPoint',
        'attack',
        'defense',
        'speed',
        'evasion',
        'accuracy',
      ]) {
        expect(params[stat]).toBeGreaterThanOrEqual(0);
      }
    });
  });

  it('should pass session to createSheep when provided', async () => {
    const session = {} as ClientSession;
    createSheep.mockResolvedValue({});

    await service.execute('user-1', session);

    expect(createSheep).toHaveBeenCalledWith(expect.any(Object), session);
  });

  it('should return the sheep created by the repository', async () => {
    const sheep = {
      userId: 'user-1',
      rarity: ERarity.Rare,
      hitPoint: 300,
      attack: 150,
      defense: 100,
      speed: 100,
      evasion: 75,
      accuracy: 50,
    };
    createSheep.mockResolvedValue(sheep);

    const result = await service.execute('user-1');

    expect(result).toEqual(sheep);
  });
});
