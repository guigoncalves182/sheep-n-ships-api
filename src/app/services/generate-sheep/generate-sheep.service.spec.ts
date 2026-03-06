import { ClientSession } from 'mongoose';
import { CONFIGURATIONS } from '../../../domain/constants/configurations.constants';
import { SheepRepository } from '../../../data/repositories/sheep/sheep.repository';
import { ERarity } from '../../../domain/sheep.interface';
import {
  GenerateSheepService,
  MAX_ROLL,
  TOTAL_STATS,
} from './generate-sheep.service';

const { minStatIndividual, maxStatIndividual } =
  CONFIGURATIONS.sheepGeneration.statConfig;
const { rarityConfig } = CONFIGURATIONS.sheepGeneration;
const minStatTotal = TOTAL_STATS * minStatIndividual;
const maxStatTotal = TOTAL_STATS * maxStatIndividual;
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
    const rarityBoundaryCases = rarityConfig.flatMap(
      ({ rarity, minRoll }, i) => {
        const maxRollForRarity =
          i === 0 ? MAX_ROLL - 1 : rarityConfig[i - 1].minRoll - 1;
        return [
          [minRoll, rarity],
          [maxRollForRarity, rarity],
        ] as [number, ERarity][];
      },
    );

    it.each(rarityBoundaryCases)(
      'roll %i should yield rarity %s',
      async (roll, expectedRarity) => {
        jest.spyOn(Math, 'random').mockReturnValue(roll / MAX_ROLL);
        createSheep.mockResolvedValue({});

        await service.execute('user-1');

        const [params] = createSheep.mock.calls[0] as [{ rarity: ERarity }];
        expect(params.rarity).toBe(expectedRarity);
      },
    );
  });

  describe('stat distribution', () => {
    it('should distribute statTotal across the 6 stats so their sum equals the computed statTotal', async () => {
      const roll = 60;
      let callCount = 0;
      jest.spyOn(Math, 'random').mockImplementation(() => {
        if (callCount++ === 0) return 0.6; // roll = Math.floor(0.6 * 100) = 60
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
        minStatTotal + Math.floor((roll * statRange) / (MAX_ROLL - 1));
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

    it(`should yield statTotal of ${maxStatTotal} when roll is ${MAX_ROLL - 1}`, async () => {
      jest.spyOn(Math, 'random').mockReturnValue((MAX_ROLL - 1) / MAX_ROLL);
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

    it(`each stat should be between ${minStatIndividual} and ${maxStatIndividual}`, async () => {
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
        expect(params[stat]).toBeGreaterThanOrEqual(minStatIndividual);
        expect(params[stat]).toBeLessThanOrEqual(maxStatIndividual);
      }
    });

    describe('stat disparity', () => {
      it('should distribute stats equally when statDisparityRate is 0', async () => {
        let callCount = 0;
        jest.spyOn(Math, 'random').mockImplementation(() => {
          if (callCount++ === 0) return 0.6; // roll = Math.floor(0.6 * 100) = 60
          return 0.5; // weights irrelevant at rate=0
        });
        createSheep.mockResolvedValue({});

        await service.execute('user-1');

        const [params] = createSheep.mock.calls[0] as [Record<string, number>];
        const stats = [
          params.hitPoint,
          params.attack,
          params.defense,
          params.speed,
          params.evasion,
          params.accuracy,
        ];
        // With rate=0 all stats are floor(equalShare), diff of at most 1 due to rounding
        expect(Math.max(...stats) - Math.min(...stats)).toBeLessThanOrEqual(1);
      });
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
