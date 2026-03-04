import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CONFIGURATIONS } from '../../../domain/constants/configurations.constants';
import { SheepRepository } from '../../../data/repositories/sheep/sheep.repository';
import { ERarity, IUserSheep } from '../../../domain/sheep.interface';

interface IGenerateSheepService {
  execute(userId: string, session?: ClientSession): Promise<IUserSheep>;
}

@Injectable()
export class GenerateSheepService implements IGenerateSheepService {
  constructor(private readonly sheepRepository: SheepRepository) {}

  private rollRarity(roll: number): ERarity {
    for (const { rarity, minRoll } of CONFIGURATIONS.sheepGeneration
      .rarityConfig) {
      if (roll >= minRoll) return rarity;
    }
    return ERarity.Common;
  }

  private distributeStats(total: number): number[] {
    const breakpoints = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * (total + 1)),
    ).sort((a, b) => a - b);

    const points = [0, ...breakpoints, total];
    return points.slice(1).map((val, i) => val - points[i]);
  }

  async execute(userId: string, session?: ClientSession): Promise<IUserSheep> {
    const { minStatTotal, maxStatTotal } =
      CONFIGURATIONS.sheepGeneration.statConfig;

    const roll = Math.floor(
      Math.random() * CONFIGURATIONS.sheepGeneration.maxRoll,
    );
    const rarity = this.rollRarity(roll);
    const statTotal =
      minStatTotal +
      Math.floor(
        (roll * (maxStatTotal - minStatTotal)) /
          (CONFIGURATIONS.sheepGeneration.maxRoll - 1),
      );
    const [hitPoint, attack, defense, speed, evasion, accuracy] =
      this.distributeStats(statTotal);

    const sheep = await this.sheepRepository.createSheep(
      {
        userId,
        rarity,
        hitPoint,
        attack,
        defense,
        speed,
        evasion,
        accuracy,
      },
      session,
    );

    return sheep;
  }
}
